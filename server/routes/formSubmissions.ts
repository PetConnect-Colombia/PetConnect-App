import { Router } from 'express';
import { AdopterFormSubmission } from '../models/AdopterFormSubmission';
import { requireAuth, requireAdmin } from '../middleware/auth';

export const formSubmissionsRouter = Router();

/**
 * POST /api/form-submissions
 * Creates a new form submission (authenticated users).
 */
formSubmissionsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const {
      fullName, email, phone, housingType, hasOtherPets, hasChildren,
      livesWithAdults, ageRange, department, city, petPreference, reasonForAdoption
    } = req.body;

    const userId = req.user ? req.user.sub : null; // Get user ID if logged in

    const newSubmission = await AdopterFormSubmission.create({
      fullName, email, phone, housingType, hasOtherPets, hasChildren,
      livesWithAdults, ageRange, department, city, petPreference, reasonForAdoption,
      user: userId,
      status: 'pendiente', // Default status
    });
    res.status(201).json({ item: newSubmission });
  } catch (error) {
    console.error('Error creating form submission:', error);
    res.status(500).json({ message: 'Error al crear la entrada del formulario.' });
  }
});

/**
 * GET /api/form-submissions
 * Lists all form submissions (admin only).
 */
formSubmissionsRouter.get('/', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const submissions = await AdopterFormSubmission.find()
      .populate('user', 'name email') // Populate user details if available
      .sort({ createdAt: -1 });
    res.json({ items: submissions });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ message: 'Error al cargar las entradas del formulario.' });
  }
});

/**
 * GET /api/form-submissions/:id
 * Gets a single form submission by ID (admin only).
 */
formSubmissionsRouter.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const submission = await AdopterFormSubmission.findById(req.params.id)
      .populate('user', 'name email');
    if (!submission) {
      return res.status(404).json({ message: 'Entrada de formulario no encontrada' });
    }
    res.json({ item: submission });
  } catch (error) {
    console.error('Error fetching form submission by ID:', error);
    res.status(500).json({ message: 'Error al cargar la entrada del formulario.' });
  }
});

/**
 * PUT /api/form-submissions/:id
 * Updates the status of a form submission (admin only).
 */
formSubmissionsRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // Only allow status update for now
    const updatedSubmission = await AdopterFormSubmission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedSubmission) {
      return res.status(404).json({ message: 'Entrada de formulario no encontrada' });
    }
    res.json({ item: updatedSubmission });
  } catch (error) {
    console.error('Error updating form submission status:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la entrada del formulario.' });
  }
});

/**
 * DELETE /api/form-submissions/:id
 * Deletes a form submission (admin only).
 */
formSubmissionsRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const deletedSubmission = await AdopterFormSubmission.findByIdAndDelete(req.params.id);
    if (!deletedSubmission) {
      return res.status(404).json({ message: 'Entrada de formulario no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting form submission:', error);
    res.status(500).json({ message: 'Error al eliminar la entrada del formulario.' });
  }
});
