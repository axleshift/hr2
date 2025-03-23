import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthContext } from '../../../src/context/authContext'
import { AppContext } from '../../../src/context/appContext'
import Login from '../../../src/views/auth/Login'
import { test, vi } from 'vitest'

const mockLogin = vi.fn()
const mockAddToast = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: actual.BrowserRouter,
  }
})

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <AuthContext.Provider
          value={{ login: mockLogin, isAuthenticated: false, userInformation: {} }}
        >
          <AppContext.Provider value={{ addToast: mockAddToast }}>
            <Login />
          </AppContext.Provider>
        </AuthContext.Provider>
      </Router>,
    )
  })

  test('renders login form', () => {
    const loginTexts = screen.getAllByText(/Login/i)
    expect(loginTexts.length).toBeGreaterThan(0)
    expect(loginTexts[0]).toBeInTheDocument()
  })

  test('validates form inputs', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => {
      expect(screen.getByText(/Username must be at least 3 characters long/i)).toBeInTheDocument()
      expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument()
    })
  })

  test('submits form with valid inputs', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => {
      console.log(mockLogin.mock.calls)
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123', expect.any(Function))
    })
  })

  test('navigates to register page', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/register')
    })
  })
})
