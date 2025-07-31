import { Router } from 'express';
import { patientController } from '../controllers/patientController';

const router = Router();

router.get('/patients', patientController.getPatients.bind(patientController));
router.get('/patients/:id', patientController.getPatientById.bind(patientController));
router.post('/patients', patientController.createPatient.bind(patientController));
router.put('/patients/:id', patientController.updatePatient.bind(patientController));

// Alias routes for "clients" to match Clinia.io pattern
router.get('/clients', patientController.getPatients.bind(patientController));
router.get('/clients/:id', patientController.getPatientById.bind(patientController));
router.post('/clients', patientController.createPatient.bind(patientController));
router.put('/clients/:id', patientController.updatePatient.bind(patientController));

export default router;