import { Router } from 'express';
import { AdoptionRequest } from '../models/AdoptionRequest';
import { Pet } from '../models/Pet';
import { AdopterFormSubmission } from '../models/AdopterFormSubmission'; // New import
import { requireAuth, requireAdmin } from '../middleware/auth';

export const adoptionRequestsRouter = Router();

// --- USER ENDPOINTS ---

/**
 * GET /api/adoption-requests/my-requests
 * Fetches all adoption requests for the currently logged-in user.
 */
adoptionRequestsRouter.get('/my-requests', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.sub;
    const requests = await AdoptionRequest.find({ user: userId })
      .populate('pet', 'name image') // Populate pet details
      .sort({ createdAt: -1 });

    res.json({ items: requests });
  } catch (error) {
    console.error('Error fetching user adoption requests:', error);
    res.status(500).json({ message: 'Error al cargar tus solicitudes de adopción.' });
  }
});

/**
 * POST /api/adoption-requests
 * Creates a new adoption request (for authenticated users).
 */
adoptionRequestsRouter.post('/', requireAuth, async (req, res) => {
  try {
    let { pet, contactEmail, contactPhone, message, formSubmission } = req.body; // Use let for formSubmission
    console.log('Received adoption request body:', req.body);
    const userId = req.user!.sub;

    // If formSubmission is not provided, create a minimal one
    if (!formSubmission) {
      const newFormSubmission = await AdopterFormSubmission.create({
        fullName: req.user?.email || 'Usuario Anónimo', // Use logged-in user's email or a placeholder
        email: contactEmail,
        phone: contactPhone,
        housingType: 'No especificado', // Default value
        hasOtherPets: false,
        hasChildren: false,
        livesWithAdults: false,
        ageRange: 'No especificado', // Default value
        department: 'No especificado', // Default value
        city: 'No especificado', // Default value
        petPreference: 'No especificado', // Default value
        reasonForAdoption: message || 'No especificado', // Use message or default
        user: userId,
        status: 'pendiente',
      });
      formSubmission = newFormSubmission._id; // Assign the ID of the newly created form submission
    }

    const newRequest = await AdoptionRequest.create({
      pet,
      user: userId,
      formSubmission, // Now formSubmission is guaranteed to have a value
      contactEmail,
      contactPhone,
      message,
      status: 'pendiente',
    });
    console.log('New adoption request created:', newRequest);
    res.status(201).json({ item: newRequest });
  } catch (error) {
    console.error('Error creating adoption request:', error);
    res.status(500).json({ message: 'Error al crear la solicitud de adopción.' });
  }
});

// --- ADMIN ENDPOINTS ---

/**
 * GET /api/adoption-requests
 * Lists all adoption requests (admin only).
 */
adoptionRequestsRouter.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate('pet', 'name image')
      .populate('user', 'name email')
      .select('+formSubmission')
      .sort({ createdAt: -1 });

    // Explicitly convert formSubmission to its string ID
    const formattedRequests = requests.map(req => ({
      ...req.toObject(),
      formSubmission: req.formSubmission ? req.formSubmission.toString() : null,
    }));

    res.json({ items: formattedRequests });
  } catch (error) {
    console.error('Error fetching adoption requests:', error);
    res.status(500).json({ message: 'Error al cargar las solicitudes de adopción.' });
  }
});

/**
 * GET /api/adoption-requests/:id
 * Gets a single adoption request by ID (admin only).
 */
adoptionRequestsRouter.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id)
      .populate('pet', 'name image')
      .populate('user', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }
    res.json({ item: request });
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    res.status(500).json({ message: 'Error al cargar la solicitud.' });
  }
});

/**
 * PUT /api/adoption-requests/:id
 * Updates the status of an adoption request (admin only).
 */
adoptionRequestsRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('pet');

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }

    if (status === 'aprobada') {
      await Pet.findByIdAndUpdate(updatedRequest.pet._id, { status: 'adoptado' });
    }

    res.json({ item: updatedRequest });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error al actualizar la solicitud.' });
  }
});

/**
 * DELETE /api/adoption-requests/:id
 * Deletes an adoption request (admin only).
 */
adoptionRequestsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deletedRequest = await AdoptionRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Solicitud no encontrada.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Error al eliminar la solicitud.' });
  }
});
