import { Router } from 'express'
import { Pet } from '../models/Pet'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { startFollowUpProcessForPet } from '../utils/followUpUtils' // New import

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
  const { status } = req.body; // Destructure status

  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada.' });
    }

    // If status is set to 'en seguimiento', trigger the follow-up process
    if (status === 'en seguimiento') {
      await startFollowUpProcessForPet(pet._id.toString());
    }

    res.json({ item: pet });
  } catch (err) {
    console.error('Error updating pet or starting follow-up:', err);
    res.status(500).json({ message: 'Error interno del servidor al actualizar mascota.' });
  }
})

/** DELETE /api/pets/:id - Elimina (admin) */
petsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id)
  res.status(204).send()
})

