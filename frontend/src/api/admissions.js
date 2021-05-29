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

export const getAdmissions = async () => {
  try {
    const { data } = await axios.get(`/api/admissions`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addAdmission = async (obj) => {
  try {
    const { data } = await axios.post(`/api/admissions`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteAdmission = async (id) => {
  try {
    const { data } = await axios.delete(`/api/admissions/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateAdmission = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/admissions/patient/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
