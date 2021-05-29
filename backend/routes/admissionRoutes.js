import express from 'express'
import {
  getAdmissions,
  addAdmission,
  deleteAdmission,
  updatePatient,
} from '../controllers/admissionController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getAdmissions).post(protect, addAdmission)
router.route('/:id').delete(protect, admin, deleteAdmission)
router.route('/patient/:id').put(protect, updatePatient)

export default router
