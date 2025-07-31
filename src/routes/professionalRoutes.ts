import { Router } from 'express';
import { professionalController } from '../controllers/professionalController';

const router = Router();

router.get('/professionals', professionalController.getProfessionals.bind(professionalController));
router.get('/professionals/:id', professionalController.getProfessionalById.bind(professionalController));
router.get('/specialties', professionalController.getSpecialties.bind(professionalController));

export default router;