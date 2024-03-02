import User from '../models/User';

export const getJoin = (req, res) => {
  return res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = 'Join';
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (password !== password2) {
    return res.render('join', {
      pageTitle,
      errorMessage: 'Password confirmation does not match.',
    });
  }
  if (exists) {
    return res.render('join', {
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
    return res.render('404', { pageTitle: `Not Found` });
  }
};

export const edit = (req, res) => res.send('Edit User');
export const remove = (req, res) => res.send('Remove User');
export const login = (req, res) => res.send('Log In');
export const logout = (req, res) => res.send('Log Out');
export const see = (req, res) => res.send('See');
