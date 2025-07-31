import { Router } from 'express';
import { locationController } from '../controllers/locationController';

const router = Router();

router.get('/locations', locationController.getLocations.bind(locationController));
router.get('/locations/:id', locationController.getLocationById.bind(locationController));

export default router;