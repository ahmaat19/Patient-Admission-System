import asyncHandler from 'express-async-handler'
import AdmissionModel from '../models/admissionModel.js'

export const getAdmissions = asyncHandler(async (req, res) => {
  const obj = await AdmissionModel.find({}).sort({ createdAt: -1 })
  res.status(201).json(obj)
})

export const addAdmission = asyncHandler(async (req, res) => {
  const patientId = req.body.patientId.toUpperCase()
  const user = req.user.id
  const {
    patient,
    doctor,
    guardian,
    relationship,
    contact,
    roomId,
    room,
    bed,
    status,
    date,
  } = req.body

  const exist = await AdmissionModel.findOne({ patientId })
  if (exist) {
    res.status(400)
    throw new Error(`This patient ${patient} already admitted`)
  }

  const roomArr = {
    roomId,
    room,
    bed,
    status,
    date,
  }
  const createObj = await AdmissionModel.create({
    user,
    patientId,
    patient,
    doctor,
    guardian,
    relationship,
    contact,
    room: roomArr,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export const updatePatient = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const patientId = req.body.patientId.toUpperCase()
  const { patient, doctor, guardian, relationship, contact } = req.body

  const obj = await AdmissionModel.findById(_id)

  if (obj) {
    const exist = await AdmissionModel.find({ _id: { $ne: _id }, patientId })
    if (exist.length === 0) {
      obj.patientId = patientId
      obj.patient = patient
      obj.doctor = doctor
      obj.guardian = guardian
      obj.relationship = relationship
      obj.contact = contact
      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error(
        `This patient ${patient} did not admitted yet or is discharged`
      )
    }
  } else {
    res.status(400)
    throw new Error(`This patient ${patient} where not found`)
  }
})

export const deleteAdmission = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await AdmissionModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('This patient is not admitted yet')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
