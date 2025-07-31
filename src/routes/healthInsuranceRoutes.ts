import { Router } from 'express';
import { healthInsuranceController } from '../controllers/healthInsuranceController';

const router = Router();

router.get('/health-insurances', healthInsuranceController.getHealthInsurances.bind(healthInsuranceController));
router.get('/health-insurances/:id', healthInsuranceController.getHealthInsuranceById.bind(healthInsuranceController));

export default router;