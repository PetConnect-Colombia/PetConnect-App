import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface para el documento de Usuario
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string; // Se hace opcional porque no siempre se devuelve
  role: 'user' | 'admin';
  comparePassword(candidate: string): Promise<boolean>;
}

// Interface para el modelo de Usuario (con métodos estáticos, si los hubiera)
export interface IUserModel extends Model<IUser> {}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    phone: { type: String, required: false, trim: true },
    password: { type: String, required: true, select: false }, // Ocultar por defecto
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Hook pre-save para hashear la contraseña
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // Asegurarse de que el error se pase a next
    next(error as Error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  if (!this.password) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(candidate, this.password);
};

export const User = (mongoose.models.User as IUserModel) || mongoose.model<IUser, IUserModel>('User', UserSchema);