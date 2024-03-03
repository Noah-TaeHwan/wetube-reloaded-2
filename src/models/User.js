import bcrypt from 'bcrypt';
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
  socialOnly: { type: Boolean, default: false },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 256);
});

const User = mongoose.model('User', userSchema);

export default User;
