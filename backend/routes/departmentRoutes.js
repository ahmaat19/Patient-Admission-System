import express from 'express'
import {
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getDepartment).post(protect, admin, addDepartment)
router
  .route('/:id')
  .delete(protect, admin, deleteDepartment)
  .put(protect, admin, updateDepartment)

export default router
