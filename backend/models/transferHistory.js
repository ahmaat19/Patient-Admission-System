import mongoose from 'mongoose'

const transferScheme = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: String,
      required: true,
      // unique: true,
    },
    patient: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    bed: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const TransferModel = mongoose.model('Transfer', transferScheme)
export default TransferModel
