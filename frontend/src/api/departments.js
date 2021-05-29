import axios from 'axios'

const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        localStorage.getItem('userInfo') &&
        JSON.parse(localStorage.getItem('userInfo')).token
      }`,
    },
  }
}

export const getDepartments = async () => {
  try {
    const { data } = await axios.get(`/api/departments`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addDepartment = async (obj) => {
  try {
    const { data } = await axios.post(`/api/departments`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateDepartment = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/departments/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteDepartment = async (id) => {
  try {
    const { data } = await axios.delete(`/api/departments/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
