/**
 * blogs.ts (router)
 * Lectura de campañas educativas.
 */

import { Router } from 'express'
import { Blog } from '../models/Blog'
import { requireAuth, requireAdmin } from '../middleware/auth'

export const blogsRouter = Router()

/** GET /api/blogs - Lista de campañas */
blogsRouter.get('/', async (_req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 })
  res.json({ items: blogs })
})

/** POST /api/blogs - Crea campaña (admin) */
blogsRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
    const blog = await Blog.create(req.body)
    res.status(201).json({ item: blog })
})

