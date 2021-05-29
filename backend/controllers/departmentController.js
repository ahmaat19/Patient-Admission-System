import asyncHandler from 'express-async-handler'
import DepartmentModel from '../models/departmentModel.js'

export const addDepartment = asyncHandler(async (req, res) => {
  const isActive = req.body.isActive
  const user = req.user.id
  const name = req.body.name.toLowerCase()
  const exist = await DepartmentModel.findOne({ name })
  if (exist) {
    res.status(400)
    throw new Error('Department already exist')
  }
  const createObj = await DepartmentModel.create({
    name,
    isActive,
    user,
  })
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export const updateDepartment = asyncHandler(async (req, res) => {
  const isActive = req.body.isActive
  const user = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.params.id

  const obj = await DepartmentModel.findById(_id)

  if (obj) {
    const exist = await DepartmentModel.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name
      obj.isActive = isActive
      obj.user = user
      await obj.save()
      res.status(201).json({ status: 'success' })
    } else {
      res.status(400)
      throw new Error('Department already exist')
    }
  } else {
    res.status(400)
    throw new Error('Department not found')
  }
})

export const getDepartment = asyncHandler(async (req, res) => {
  const obj = await DepartmentModel.find({}).sort({ createdAt: -1 })
  res.status(201).json(obj)
})

export const deleteDepartment = asyncHandler(async (req, res) => {
  const _id = req.params.id
  const obj = await DepartmentModel.findById(_id)
  if (!obj) {
    res.status(400)
    throw new Error('Department not found')
  } else {
    await obj.remove()
    res.status(201).json({ status: 'success' })
  }
})
