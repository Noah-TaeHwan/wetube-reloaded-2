import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
