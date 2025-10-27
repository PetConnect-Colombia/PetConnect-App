/**
 * Pet.ts
 * Modelo de mascotas con campos usados por el catálogo.
 */

import mongoose from 'mongoose'

export type PetKind = 'Perro' | 'Gato'

export interface IPet extends mongoose.Document {
  name: string
  age: string
  kind: PetKind
  shortBio: string
  personality: string
  rescuer: string
  size: string
  history: string
  image: string
}

const PetSchema = new mongoose.Schema<IPet>(
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
  },
  { timestamps: true }
)

export const Pet = mongoose.model<IPet>('Pet', PetSchema)
