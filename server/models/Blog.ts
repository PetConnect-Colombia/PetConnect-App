/**
 * Blog.ts
 * Modelo básico de campañas educativas.
 */

import mongoose from 'mongoose'

export interface IBlog extends mongoose.Document {
  title: string
  summary: string
  image: string
  content: string
}

const BlogSchema = new mongoose.Schema<IBlog>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema)
