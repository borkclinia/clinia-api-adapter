import { Router } from 'express';
import locationRoutes from './locationRoutes';
import healthInsuranceRoutes from './healthInsuranceRoutes';
import professionalRoutes from './professionalRoutes';
import patientRoutes from './patientRoutes';
import scheduleRoutes from './scheduleRoutes';
import appointmentRoutes from './appointmentRoutes';

const router = Router();

// Mount routes
router.use('/', locationRoutes);
router.use('/', healthInsuranceRoutes);
router.use('/', professionalRoutes);
router.use('/', patientRoutes);
router.use('/', scheduleRoutes);
router.use('/', appointmentRoutes);

export default router;