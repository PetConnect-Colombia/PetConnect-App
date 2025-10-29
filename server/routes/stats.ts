import { Router } from 'express';
import { Pet, IPet } from '../models/Pet'; // Import IPet for type annotation
import { AdoptionRequest } from '../models/AdoptionRequest';
import { requireAuth, requireAdmin } from '../middleware/auth';

export const statsRouter = Router();

/**
 * @route   GET /api/stats/dashboard
 * @desc    Get all dashboard summary statistics
 * @access  Private (Admin)
 */
statsRouter.get('/dashboard', requireAuth, requireAdmin, async (_req, res) => {
  try {
    // Perform all database queries in parallel for efficiency
    const [totalPets, adoptedPets, availablePets, inProcessPets, pendingRequests, approvedRequests, rejectedRequests, petsByKind] = await Promise.all([
      Pet.countDocuments(),
      Pet.countDocuments({ status: 'adoptado' }),
      Pet.countDocuments({ status: 'disponible' }),
      Pet.countDocuments({ status: 'en proceso de adopción' }),
      AdoptionRequest.countDocuments({ status: 'pendiente' }),
      AdoptionRequest.countDocuments({ status: 'aprobada' }),
      AdoptionRequest.countDocuments({ status: 'rechazada' }),
      Pet.aggregate([
        { $group: { _id: '$kind', count: { $sum: 1 } } },
      ]),
    ]);

    // Convert the aggregation result into a more friendly object
    const petsByKindMap = petsByKind.reduce((acc: { [key: string]: number }, item: { _id: IPet['kind'], count: number }) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      totalPets,
      adoptedPets,
      availablePets,
      inProcessPets,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      petsByKind: petsByKindMap,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error al obtener las estadísticas del dashboard.' });
  }
});
