import { Router } from 'express';
import cliniaRoutes from './cliniaRoutes';

// Import legacy routes for backwards compatibility
import locationRoutes from './locationRoutes';
import healthInsuranceRoutes from './healthInsuranceRoutes';
import professionalRoutes from './professionalRoutes';
import patientRoutes from './patientRoutes';
import scheduleRoutes from './scheduleRoutes';
import appointmentRoutes from './appointmentRoutes';

const router = Router();

// Primary routes - Clinia.io compatible
router.use('/', cliniaRoutes);

// Legacy routes for backwards compatibility (lower priority)
// These will only match if not caught by cliniaRoutes
router.use('/', locationRoutes);
router.use('/', healthInsuranceRoutes);
router.use('/', professionalRoutes);
router.use('/', patientRoutes);
router.use('/', scheduleRoutes);
router.use('/', appointmentRoutes);

export default router;