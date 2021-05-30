import express from 'express'
import {
  getPatients,
  addPatient,
  deletePatient,
  updatePatient,
  getPatientDetails,
} from '../controllers/patientController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getPatients).post(protect, addPatient)
router.route('/:id').delete(protect, admin, deletePatient)
router.route('/patient/:id').put(protect, updatePatient)
router.route('/patient/details/:id').get(protect, getPatientDetails)

export default router
