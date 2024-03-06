import fetch from 'node-fetch';
import User from '../models/User';
import bcrypt from 'bcrypt';
import Video from '../models/video';

export const getJoin = (req, res) => {
  return res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = 'Join';
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.status(400).render('join', {
      pageTitle,
      errorMessage: 'Password confirmation does not match.',
    });
  }
  if (exists) {
    return res.status(400).render('join', {
      pageTitle,
      errorMessage: 'This username/email is already taken.',
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect('/login');
  } catch (error) {
    console.log(req.body);
    return res
      .status(404)
      .render('404', { pageTitle: `Not Found`, errorMessage: error._message });
  }
};

export const getLogin = (req, res) => {
  return res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = 'Log In';
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'An account with this username does not exists.',
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render('login', {
      pageTitle,
      errorMessage: 'Wrong password.',
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect('/');
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: true,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  if ('access_token' in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect('/login');
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name ? userData.name : userData.login,
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: '',
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

export const getEdit = (req, res) => {
  return res.render('edit-profile', { pageTitle: 'Edit Profile' });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      // 업로드된 파일이 있으면 /uploads/와 파일명을 결합, 없으면 기존 avatarUrl 사용
      avatarUrl: file ? `/uploads/${file.filename}` : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true } // 업데이트된 문서를 반환하도록 설정
  );

  // 세션 정보 업데이트
  req.session.user = {
    ...req.session.user,
    avatarUrl: updatedUser.avatarUrl,
    name: updatedUser.name,
    email: updatedUser.email,
    username: updatedUser.username,
    location: updatedUser.location,
  };

  return res.redirect('/users/edit');
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect('/');
  }
  return res.render('users/change-password', {
    pageTitle: 'Change Password',
  });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The Current Password Is Incorrect',
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The New Password Does Not Match The Confirmation.',
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;

  return res.redirect('/users/logout');
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).render('404', { pageTitle: 'User not found.' });
  }
  const videos = await Video.find({ owner: user._id });
  return res.render('users/profile', {
    pageTitle: user.name,
    user,
    videos,
  });
};
