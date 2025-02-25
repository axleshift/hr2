import axios from 'axios'
import { config } from '../config'

const baseUrl = config.server.url
const apiKey = config.server.apiKey

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey,
  },
})

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    // This is an Axios error
    return {
      status: error.response ? error.response.status : null,
      message: error.response ? error.response.data : error.message,
    }
  } else {
    // This is a non-Axios error
    return { status: null, message: error.message }
  }
}

const post = async (url, data) => {
  try {
    const response = await instance.post(url, data)
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('POST Error:', handledError)
    return handledError // return error information
  }
}

const get = async (url) => {
  try {
    const response = await instance.get(url)
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('GET Error:', handledError)
    return handledError // return error information
  }
}

const put = async (url, data) => {
  try {
    const response = await instance.put(url, data)
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('PUT Error:', handledError)
    return handledError // return error information
  }
}

const del = async (url) => {
  try {
    const response = await instance.delete(url)
    return response
  } catch (error) {
    const handledError = handleError(error)
    console.error('DELETE Error:', handledError)
    return handledError // return error information
  }
}

// for fetching files from the server
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
    return handledError // return error information
  }
}

export { post, get, put, del, getFile }
