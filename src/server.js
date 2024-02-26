import express from 'express';

const PORT = 4000;

const app = express();

const handleListening = () =>
  console.log(`✅ Server Listening On Port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
