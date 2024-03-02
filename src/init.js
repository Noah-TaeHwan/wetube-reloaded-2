import 'dotenv/config.js';
import './db.js';
import './models/video.js';
import './models/User.js';
import app from './server.js';

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server Listening On Port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
