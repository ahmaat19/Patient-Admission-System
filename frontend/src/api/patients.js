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

export const getPatients = async () => {
  try {
    const { data } = await axios.get(`/api/patients`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getPatientDetails = async (id) => {
  try {
    const { data } = await axios.get(
      `/api/patients/patient/details/${id}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addPatient = async (obj) => {
  try {
    const { data } = await axios.post(`/api/patients`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deletePatient = async (id) => {
  try {
    const { data } = await axios.delete(`/api/patients/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updatePatient = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/patients/patient/${obj._id}`,
      obj.updatedData,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updatePatientTransfer = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/patients/patient/transfer/${obj._id}`,
      obj.updatedData,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updatePatientDischarge = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/patients/patient/discharge/${obj._id}`,
      obj.updatedData,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getPatientTransfer = async (patientId) => {
  try {
    const { data } = await axios.get(
      `/api/patients/patient/transfer/${patientId}`,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
