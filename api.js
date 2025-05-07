
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const registerStudent = async (student, guardianId) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
    student, guardianId
  })
  return response.data
} catch (error) {
  console.error('Registration Failed', error)
  throw error
  }
}
