import express from 'express';

const PORT = 4000;

const app = express();

const handleHome = () => console.log('Somebody is trying to go home.');

app.get('/', handleHome);

const handleListening = () =>
  console.log(`✅ Server Listening On Port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
