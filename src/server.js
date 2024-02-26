import express from 'express';

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const handleHome = (req, res) => {
  return res.end();
};

app.get('/', logger, handleHome);

const handleListening = () =>
  console.log(`✅ Server Listening On Port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
