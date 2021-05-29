import asyncHandler from 'express-async-handler'
import RoomModel from '../models/roomModel.js'

export const addRoom = asyncHandler(async (req, res) => {
  const isActive = req.body.isActive
  const name = req.body.name.toLowerCase()
  const bed = req.body.bed
  const user = req.user.id
  const department = req.body.department

  const exist = await RoomModel.findOne({ name })
  if (exist) {
    res.status(400)
    throw new Error('Room already exist')
  }
  const createObj = await RoomModel.create({
    name,
    bed,
    user,
    department,
    isActive,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export const updateRoom = asyncHandler(async (req, res) => {
  const isActive = req.body.isActive
  const name = req.body.name.toLowerCase()
  const bed = req.body.bed
  const _id = req.params.id
  const user = req.user.id
  const department = req.body.department

  const obj = await RoomModel.findById(_id)

  if (obj) {
    const exist = await RoomModel.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name
      obj.bed = bed
      obj.isActive = isActive
      obj.user = user
      obj.department = department
      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Room already exist')
    }
  } else {
    res.status(400)
    throw new Error('Room not found')
  }
})

export const getRoom = asyncHandler(async (req, res) => {
  const obj = await RoomModel.find({})
    .sort({ createdAt: -1 })
    .populate('department', ['name'])
  res.status(201).json(obj)
})

export const deleteRoom = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await RoomModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Room not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
