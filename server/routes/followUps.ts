import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';
import { FollowUp, IFollowUp } from '../models/FollowUp';
import { AdoptionRequest } from '../models/AdoptionRequest';

export const followUpsRouter = Router();

// Proteger todas las rutas de este archivo con autenticación y rol de admin
followUpsRouter.use(requireAuth, requireAdmin);

// GET /api/follow-ups - Obtener todos los seguimientos, agrupados por mascota
followUpsRouter.get('/', async (req, res) => {
  try {
    const followUps = await FollowUp.find().populate({
      path: 'adoptionRequest',
      populate: {
        path: 'pet user'
      }
    });

    // Agrupar por mascota
    const groupedByPet = followUps.reduce((acc, followUp) => {
      const adoptionReq = followUp.adoptionRequest as any; // Usar 'any' para simplicidad con Mongoose populate
      if (!adoptionReq || !adoptionReq.pet) {
        return acc;
      }
      const petId = adoptionReq.pet._id.toString();
      if (!acc[petId]) {
        acc[petId] = {
          pet: adoptionReq.pet,
          adopter: adoptionReq.user,
          visits: {},
        };
      }
      acc[petId].visits[followUp.visitType] = followUp;
      return acc;
    }, {} as any);

    res.json(Object.values(groupedByPet));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// GET /api/follow-ups/by-pet/:petId - Obtener seguimientos por ID de mascota
followUpsRouter.get('/by-pet/:petId', async (req, res) => {
    try {
      const adoptionRequest = await AdoptionRequest.findOne({ pet: req.params.petId, status: 'aprobada' });
      if (!adoptionRequest) {
        return res.json([]);
      }
      const followUps = await FollowUp.find({ adoptionRequest: adoptionRequest._id }).populate({
        path: 'adoptionRequest',
        populate: {
          path: 'pet user'
        }
      });
      res.json(followUps);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error del servidor');
    }
  });

// GET /api/follow-ups/:id - Obtener un seguimiento por su ID
followUpsRouter.get('/:id', async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id).populate({
      path: 'adoptionRequest',
      populate: {
        path: 'pet'
      }
    });
    if (!followUp) {
      return res.status(404).json({ msg: 'Seguimiento no encontrado' });
    }
    res.json(followUp);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// POST /api/follow-ups/start - Iniciar el proceso de seguimiento para una mascota
followUpsRouter.post('/start', async (req, res) => {
  const { petId } = req.body;
  try {
    const adoptionRequest = await AdoptionRequest.findOne({ pet: petId, status: 'aprobada' });
    if (!adoptionRequest) {
      return res.status(404).json({ msg: 'No se encontró solicitud de adopción aprobada.' });
    }

    const existing = await FollowUp.find({ adoptionRequest: adoptionRequest._id });
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'El seguimiento para esta mascota ya fue iniciado.' });
    }

    const adoptionDate = adoptionRequest.updatedAt || new Date();
    const visitDates = [
      { visitType: '1-month', visitDate: new Date(new Date(adoptionDate).setMonth(adoptionDate.getMonth() + 1)) },
      { visitType: '3-month', visitDate: new Date(new Date(adoptionDate).setMonth(adoptionDate.getMonth() + 3)) },
      { visitType: '6-month', visitDate: new Date(new Date(adoptionDate).setMonth(adoptionDate.getMonth() + 6)) },
    ];

    const createdFollowUps = await Promise.all(visitDates.map(visit => {
      const newFollowUp = new FollowUp({
        adoptionRequest: adoptionRequest._id,
        visitType: visit.visitType,
        visitDate: visit.visitDate,
        status: 'Programada',
      });
      return newFollowUp.save();
    }));

    res.status(201).json(createdFollowUps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// PUT /api/follow-ups/:id - Actualizar un seguimiento
followUpsRouter.put('/:id', async (req, res) => {
  const { mood, health, weight, notes, status, visitDate } = req.body;
  
  const fieldsToUpdate: Partial<IFollowUp> = {};
  if (mood) fieldsToUpdate.mood = mood;
  if (health) fieldsToUpdate.health = health;
  if (weight) fieldsToUpdate.weight = weight;
  if (notes) fieldsToUpdate.notes = notes;
  if (status) fieldsToUpdate.status = status;
  if (visitDate) fieldsToUpdate.visitDate = visitDate;

  try {
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      { new: true }
    );

    if (!followUp) return res.status(404).json({ msg: 'Seguimiento no encontrado' });

    res.json(followUp);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// DELETE /api/follow-ups/:id - Eliminar un seguimiento
followUpsRouter.delete('/:id', async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) return res.status(404).json({ msg: 'Seguimiento no encontrado' });

    await FollowUp.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Seguimiento eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});
