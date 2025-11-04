import { AdoptionRequest } from '../models/AdoptionRequest';
import { FollowUp } from '../models/FollowUp';

export const startFollowUpProcessForPet = async (petId: string) => {
  try {
    // 1. Find the approved adoption request for the pet
    const adoptionRequest = await AdoptionRequest.findOne({ pet: petId, status: 'aprobada' });

    if (!adoptionRequest) {
      console.warn(`No se encontró una solicitud de adopción aprobada para la mascota ${petId}. No se iniciará el seguimiento.`);
      return [];
    }

    // 2. Check if follow-ups for this adoption have already been created
    const existingFollowUps = await FollowUp.find({ adoptionRequest: adoptionRequest._id });

    if (existingFollowUps.length > 0) {
      console.warn(`El seguimiento para la mascota ${petId} ya ha sido iniciado.`);
      return existingFollowUps;
    }

    // 3. Create all three follow-up visits
    const adoptionDate = adoptionRequest.updatedAt || new Date(); // Assuming this is the approval date
    const visitDates = [
      { visitType: '1-month', visitDate: new Date(new Date(adoptionDate).setMonth(adoptionDate.getMonth() + 1)) },
      { visitType: '3-month', visitDate: new Date(new Date(adoptionDate).setMonth(adoptionDate.getMonth() + 3)) },
      { visitType: '6-month', visitDate: new Date(new Date(adoptionDate).setMonth(adoptionDate.getMonth() + 6)) },
    ];

    const createdFollowUps = await Promise.all(visitDates.map(async (visit) => {
      const newFollowUp = new FollowUp({
        adoptionRequest: adoptionRequest._id,
        visitType: visit.visitType,
        visitDate: visit.visitDate,
        status: 'Programada',
      });
      return await newFollowUp.save();
    }));

    return createdFollowUps;

  } catch (err) {
    console.error('Error al iniciar el proceso de seguimiento para la mascota:', petId, err);
    throw err; // Re-throw the error for handling upstream
  }
};
