import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the Pet document
export interface IPet extends Document {
  name: string;
  age: string;
  kind: 'Perro' | 'Gato';
  shortBio: string;
  personality: string;
  rescuer: string;
  size: string;
  history: string;
  image: string;
  status: 'disponible' | 'en proceso de adopción' | 'en seguimiento' | 'adoptado';
}

// Interface for the Pet model
export interface IPetModel extends Model<IPet> {}

const PetSchema: Schema<IPet> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: String, required: true },
    kind: { type: String, enum: ['Perro', 'Gato'], required: true },
    shortBio: { type: String, required: true },
    personality: { type: String, required: true },
    rescuer: { type: String, required: true },
    size: { type: String, required: true },
    history: { type: String, required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ['disponible', 'en proceso de adopción', 'en seguimiento', 'adoptado'],
      default: 'disponible',
      required: true,
    },
  },
  { timestamps: true }
);

export const Pet = (mongoose.models.Pet as IPetModel) || mongoose.model<IPet, IPetModel>('Pet', PetSchema);
