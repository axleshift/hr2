import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ManageFacilityForm from '../modals/ManageFacilityForm'
import { AppContext } from '../../../context/appContext'

// filepath: /d:/hr2/client/src/views/Facility/modals/ManageFacilityForm.test.js

describe('ManageFacilityForm', () => {
  const mockOnClose = jest.fn()
  const mockAddToast = jest.fn()
  const facilityData = { _id: '123', name: 'Test Facility' }

  beforeEach(() => {
    render(
      <AppContext.Provider value={{ addToast: mockAddToast }}>
        <ManageFacilityForm isVisible={true} onClose={mockOnClose} facilityData={facilityData} />
      </AppContext.Provider>,
    )
  })

  test('renders form correctly', () => {
    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/End Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Capacity/i)).toBeInTheDocument()
  })

  test('submits form with valid data', async () => {
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Test Event' } })
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Test Description' },
    })
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-10-10' } })
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '10:00' } })
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: '12:00' } })
    fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: '10' } })

    fireEvent.click(screen.getByText(/Submit/i))

    expect(mockAddToast).toHaveBeenCalledWith('Success', 'Event created successfully', 'success')
  })

  test('shows validation errors for invalid data', async () => {
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: 'invalid-date' } })
    fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: 'invalid-time' } })
    fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: 'invalid-time' } })
    fireEvent.change(screen.getByLabelText(/Capacity/i), { target: { value: '-1' } })

    fireEvent.click(screen.getByText(/Submit/i))

    expect(screen.getByText(/Event Name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Invalid date format/i)).toBeInTheDocument()
    expect(screen.getByText(/Invalid time format/i)).toBeInTheDocument()
    expect(screen.getByText(/Capacity must be a positive number/i)).toBeInTheDocument()
  })
})
