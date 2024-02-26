import express from 'express';

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
  console.log('Somebody is trying to go home.');
  return res.send('Hello');
};

const handleLogin = (req, res) => {
  return res.send('Login');
};

app.get('/', handleHome);
app.get('/login', handleLogin);

const handleListening = () =>
  console.log(`✅ Server Listening On Port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
