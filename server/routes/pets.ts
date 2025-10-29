/**
 * pets.ts (router)
 * CRUD de mascotas. Lectura pública, escritura sólo admin.
 */

import { Router } from 'express'
import { Pet } from '../models/Pet'
import { requireAuth, requireAdmin } from '../middleware/auth'

export const petsRouter = Router()

/** GET /api/pets - Lista todas las mascotas */
petsRouter.get('/', async (_req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 })
  res.json({ items: pets })
})

/** POST /api/pets - Crea mascota (admin) */
petsRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  const pet = await Pet.create(req.body)
  res.status(201).json({ item: pet })
})

/** GET /api/pets/:id - Obtiene una mascota por ID (público) */
petsRouter.get('/:id', async (req, res) => {
  const pet = await Pet.findById(req.params.id)
  if (!pet) {
    return res.status(404).json({ message: 'Mascota no encontrada.' })
  }
  res.json({ item: pet })
})

/** PUT /api/pets/:id - Actualiza (admin) */
petsRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json({ item: pet })
})

/** DELETE /api/pets/:id - Elimina (admin) */
petsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

