import { Router } from 'express';
import { clientSearchController } from '../controllers/clientSearchController';
import { locationController } from '../controllers/locationController';
import { professionalController } from '../controllers/professionalController';
import { healthInsuranceController } from '../controllers/healthInsuranceController';
import { appointmentController } from '../controllers/appointmentController';
import { scheduleController } from '../controllers/scheduleController';
import { serviceController } from '../controllers/serviceController';
import { planController } from '../controllers/planController';
import { validateClientSearch, validatePagination } from '../middleware/validation';

const router = Router();

// ===== ENDPOINTS ESPECÍFICOS PARA CLINIA.IO =====

// Locations - endpoint que a Clinia está testando
router.get('/locations', validatePagination, locationController.getLocations.bind(locationController));
router.get('/locations/:id', locationController.getLocationById.bind(locationController));

// Clients - endpoint principal para busca de clientes
router.get('/clients', validatePagination, clientSearchController.getClients.bind(clientSearchController));
router.get('/clients/search', validateClientSearch, validatePagination, clientSearchController.searchClient.bind(clientSearchController));
router.get('/clients/:id', clientSearchController.getClientById.bind(clientSearchController));

// Professionals
router.get('/professionals', professionalController.getProfessionals.bind(professionalController));
router.get('/professionals/:id', professionalController.getProfessionalById.bind(professionalController));

// Specialties
router.get('/specialties', professionalController.getSpecialties.bind(professionalController));
router.get('/specialties/:id', professionalController.getSpecialtyById.bind(professionalController));

// Services
router.get('/services', serviceController.getServices.bind(serviceController));
router.get('/services/:id', serviceController.getServiceById.bind(serviceController));

// Health Insurance (Convenios)
router.get('/health-insurances', healthInsuranceController.getHealthInsurances.bind(healthInsuranceController));
router.get('/health-insurances/:id', healthInsuranceController.getHealthInsuranceById.bind(healthInsuranceController));

// Plans
router.get('/plans', planController.getPlans.bind(planController));
router.get('/plans/:id', planController.getPlanById.bind(planController));

// Schedules
router.get('/schedule', scheduleController.getSchedule.bind(scheduleController));
router.get('/schedules', scheduleController.getSchedule.bind(scheduleController));
router.get('/schedules/available-slots', scheduleController.getAvailableSlots.bind(scheduleController));

// Appointments
router.get('/appointments', appointmentController.getAppointments.bind(appointmentController));
router.get('/appointments/:id', appointmentController.getAppointmentById.bind(appointmentController));
router.post('/appointments', appointmentController.createAppointment.bind(appointmentController));
router.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus.bind(appointmentController));
router.post('/appointments/:id/cancel', appointmentController.cancelAppointment.bind(appointmentController));

// ===== ENDPOINTS DE COMPATIBILIDADE (rotas antigas) =====

// Manter compatibilidade com implementação anterior
router.get('/patients', clientSearchController.searchClient.bind(clientSearchController));
router.get('/patients/:id', clientSearchController.getClientById.bind(clientSearchController));

export default router;