import axios from 'axios'
import { config } from '../config'

const baseUrl = config.server.url
const apiKey = config.server.apiKey

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'X-API-KEY': apiKey,
  },
})

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response ? error.response.status : null,
      message: error.response ? error.response.data : error.message,
    }
  } else {
    return { status: null, message: error.message }
  }
}

const post = async (url, data) => {
  try {
    const isFormData = data instanceof FormData

    const response = await instance.post(url, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })

    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('POST Error:', handledError)
    return handledError
  }
}

const put = async (url, data) => {
  try {
    const isFormData = data instanceof FormData

    const response = await instance.put(url, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })

    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('PUT Error:', handledError)
    return handledError
  }
}

const get = async (url) => {
  try {
    const response = await instance.get(url)
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('GET Error:', handledError)
    return handledError
  }
}

const del = async (url) => {
  try {
    const response = await instance.delete(url)
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('DELETE Error:', handledError)
    return handledError
  }
}

const getFile = async (url, options = {}) => {
  const { responseType = 'blob', headers = {} } = options

  try {
    const response = await instance.get(url, {
      responseType: responseType,
      headers: headers,
    })
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('Error fetching file:', handledError)
    return handledError
  }
}

export { post, get, put, del, getFile }
