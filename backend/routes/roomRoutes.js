import express from 'express'
import {
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getRoom).post(protect, admin, addRoom)
router
  .route('/:id')
  .delete(protect, admin, deleteRoom)
  .put(protect, admin, updateRoom)

export default router
