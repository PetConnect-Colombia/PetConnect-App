/**
 * User.ts
 * Modelo de usuario con hash de contraseña y rol.
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  comparePassword: (candidate: string) => Promise<boolean>
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export const User = mongoose.model<IUser>('User', UserSchema)
