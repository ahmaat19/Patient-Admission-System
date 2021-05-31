import asyncHandler from 'express-async-handler'
import PatientModel from '../models/patientModel.js'

export const getPatients = asyncHandler(async (req, res) => {
  const obj = await PatientModel.find({}).sort({ createdAt: -1 })
  res.status(201).json(obj)
})

export const getPatientDetails = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await PatientModel.findById(_id)

  if (!obj) {
    res.status(400)
    throw new Error(`This patient where not found`)
  } else {
    res.status(201).json(obj)
  }
})

export const addPatient = asyncHandler(async (req, res) => {
  const patientId = req.body.patientId.toUpperCase()
  const user = req.user.id
  const {
    patient,
    doctor,
    guardian,
    relationship,
    contact,
    room,
    department,
    bed,
    status,
    date,
  } = req.body

  const exist = await PatientModel.findOne({
    patientId,
    generalStatus: { $eq: 'Discharged' },
  })
  if (exist) {
    res.status(400)
    throw new Error(`This patient ${patient} already admitted`)
  }

  const roomArr = {
    room,
    department,
    bed,
    status,
    date,
  }
  const createObj = await PatientModel.create({
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

  const obj = await PatientModel.findById(_id)

  if (obj) {
    const exist = await PatientModel.find({
      _id: { $ne: _id },
      patientId,
      generalStatus: { $eq: 'Discharged' },
    })
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
      throw new Error(`This patient ${patientId} already admitted`)
    }
  } else {
    res.status(400)
    throw new Error(`This patient ${patient} where not found`)
  }
})

export const deletePatient = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await PatientModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('This patient is not admitted yet')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
