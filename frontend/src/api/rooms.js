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

export const getRooms = async () => {
  try {
    const { data } = await axios.get(`/api/rooms`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addRoom = async (obj) => {
  try {
    const { data } = await axios.post(`/api/rooms`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateRoom = async (obj) => {
  try {
    const { data } = await axios.put(`/api/rooms/${obj._id}`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteRoom = async (id) => {
  try {
    const { data } = await axios.delete(`/api/rooms/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
