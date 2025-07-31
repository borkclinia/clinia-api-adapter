import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';

const router = Router();

router.get('/appointments', appointmentController.getAppointments.bind(appointmentController));
router.get('/appointments/:id', appointmentController.getAppointmentById.bind(appointmentController));
router.post('/appointments', appointmentController.createAppointment.bind(appointmentController));
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus.bind(appointmentController));
router.post('/appointments/:id/cancel', appointmentController.cancelAppointment.bind(appointmentController));

export default router;