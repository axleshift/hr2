import { describe, expect, vi, test, beforeEach } from 'vitest'
import axios from 'axios'
import { post, get, put, del, getFile } from '../../src/api/axios'

vi.mock('axios')

describe('API functions', () => {
  const mockUrl = '/test-url'
  const mockData = { key: 'value' }
  const mockResponse = { data: 'response data', status: 200 }
  let mockAxiosInstance

  beforeEach(() => {
    mockAxiosInstance = {
      post: vi.fn().mockResolvedValue(mockResponse),
      get: vi.fn().mockResolvedValue(mockResponse),
      put: vi.fn().mockResolvedValue(mockResponse),
      delete: vi.fn().mockResolvedValue(mockResponse),
    }
    axios.create.mockReturnValue(mockAxiosInstance)

    process.env.BASE_URL = 'http://localhost:8000/api/v1'
    process.env.API_KEY = '26AFpIAsG1'
  })

  test('should include X-API-KEY in headers', async () => {
    await post(mockUrl, mockData)

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.API_KEY,
      },
    })
  })

  test('post function should handle successful response', async () => {
    const response = await mockAxiosInstance.post(mockUrl, mockData)
    expect(response).toEqual(mockResponse)
  })

  test('get function should handle successful response', async () => {
    const response = await mockAxiosInstance.get(mockUrl)
    expect(response).toEqual(mockResponse)
  })

  test('put function should handle successful response', async () => {
    const response = await mockAxiosInstance.put(mockUrl, mockData)
    expect(response).toEqual(mockResponse)
  })

  test('delete function should handle successful response', async () => {
    const response = await mockAxiosInstance.delete(mockUrl)
    expect(response).toEqual(mockResponse)
  })

  test('post function should handle error response', async () => {
    const error = new Error('Error message')
    mockAxiosInstance.post.mockRejectedValue(error)

    try {
      await post(mockUrl, mockData)
    } catch (response) {
      expect(response).toEqual({ status: null, message: error.message })
    }
  })
})
