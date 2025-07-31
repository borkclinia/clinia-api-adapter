import { Router } from 'express';
import { scheduleController } from '../controllers/scheduleController';

const router = Router();

router.get('/schedules', scheduleController.getSchedule.bind(scheduleController));
router.get('/schedules/available-slots', scheduleController.getAvailableSlots.bind(scheduleController));

export default router;