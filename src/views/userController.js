import User from '../models/User';

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
  const exists = await User.exists({ username });
  if (!exists) {
    return res.status(400).render('login', {
      pageTitle: 'Log In',
      errorMessage: 'An account with this username does not exists.',
    });
  }
  return res.render('login');
};

export const edit = (req, res) => res.send('Edit User');
export const remove = (req, res) => res.send('Remove User');
export const logout = (req, res) => res.send('Log Out');
export const see = (req, res) => res.send('See');
