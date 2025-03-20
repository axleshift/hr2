import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, vi } from 'vitest'
import Register from './Register'
import { AppContext } from '../../context/appContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { post } from '../../api/axios'

vi.mock('../../api/axios')

const mockAddToast = vi.fn()

const renderComponent = () =>
  render(
    <Router>
      <AppContext.Provider value={{ addToast: mockAddToast }}>
        <Register />
      </AppContext.Provider>
    </Router>,
  )

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders register form', () => {
    renderComponent()

    const registerTexts = screen.getAllByText(/Register/i)
    expect(registerTexts.length).toBeGreaterThan(0)
    expect(registerTexts[0]).toBeInTheDocument()
  })

  test('validates form inputs', async () => {
    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /Create account/i }))

    await waitFor(() => {
      const firstnameError = screen.getAllByText(/Firstname must be at least 3 characters long/i)
      expect(firstnameError.length).toBeGreaterThan(0)
      expect(firstnameError[0]).toBeInTheDocument()

      // const lastnameError = screen.getAllByText(/Lastname must be at least 3 characters long/i)
      // expect(lastnameError.length).toBeGreaterThan(0)
      // expect(lastnameError[0]).toBeInTheDocument()

      const usernameError = screen.getAllByText(/Username must be at least 3 characters long/i)
      expect(usernameError.length).toBeGreaterThan(0)
      expect(usernameError[0]).toBeInTheDocument()

      const emailError = screen.getAllByText(/Invalid email format/i)
      expect(emailError.length).toBeGreaterThan(0)
      expect(emailError[0]).toBeInTheDocument()

      const passwordError = screen.getAllByText(/Password must be at least 8 characters long/i)
      expect(passwordError.length).toBeGreaterThan(0)
      expect(passwordError[0]).toBeInTheDocument()
    })
  })
})
