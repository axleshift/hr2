import React, { createContext, useState, useEffect, Suspense } from 'react'
import propTypes from 'prop-types'
import {
  CToaster,
  CToast,
  CToastHeader,
  CToastClose,
  CToastBody,
  CButton,
  CSpinner,
} from '@coreui/react'

export const AppContext = createContext()
// I might forget how all this works, so I'll add some comments to help me remember later.
// Note to self: The Concerta is wearing off, so I'm going to take a break and come back to this later.

const AppProvider = ({ children }) => {
  // State for holding the active toasts
  const [toasts, setToasts] = useState([])

  // State for managing the timeouts associated with each toast
  const [timeouts, setTimeouts] = useState({})

  const [milliseconds, setMilliseconds] = useState(10000)

  /**
   * Function to add a new toast with the given parameters.
   * @param {string} title - Title of the toast.
   * @param {string} message - Message content of the toast.
   * @param {string} color - Optional color of the toast (defaults to 'success').
   * @param {function|null} action - Optional callback function for an action button.
   * @param {string} actionLabel - Optional label for the action button (defaults to 'Action').
   */
  const addToast = (title, message, color = 'success', action = null, actionLabel = 'Action') => {
    const id = Date.now() // Generate a unique ID based on the current timestamp
    const expiryTime = id + milliseconds // Set expiry time (10 seconds after creation)
    // TODO: Calculate the expiry time based on the message length

    // Update the toasts state with the new toast
    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        message,
        color,
        visible: true,
        expiryTime,
        isHovered: false,
        action,
        actionLabel,
      },
    ])

    // Set a timeout to automatically remove the toast after 5 seconds
    const timeoutId = setTimeout(() => removeToast(id), milliseconds)
    setTimeouts((prev) => ({ ...prev, [id]: timeoutId }))
  }

  /**
   * Function to remove a toast by its ID.
   * It first sets the toast's visibility to false, and after 5 seconds, removes it from the state.
   * @param {number} id - The ID of the toast to remove.
   */
  const removeToast = (id) => {
    // Set the toast visibility to false for the given ID
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, visible: false } : toast)),
    )

    // After 5 seconds, remove the toast from the state completely
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), milliseconds)
  }

  /**
   * Clears the removal timeout for a specific toast.
   * @param {number} id - The ID of the toast to clear the removal timeout.
   */
  const clearRemovalTimeout = (id) => {
    clearTimeout(timeouts[id]) // Clears the timeout associated with the given ID
  }

  /**
   * Resets the removal timeout for a specific toast.
   * @param {number} id - The ID of the toast to reset the removal timeout.
   */
  const resetRemovalTimeout = (id) => {
    const timeoutId = setTimeout(() => removeToast(id), milliseconds) // Reset the timeout
    setTimeouts((prev) => ({ ...prev, [id]: timeoutId }))
  }

  /**
   * Returns a human-readable string showing the time passed since the toast was created.
   * @param {number} timestamp - The timestamp when the toast was created.
   * @returns {string} - A string representing how much time has passed since the toast was created.
   */
  const timeAgo = (timestamp) => {
    const now = Date.now() // Get the current timestamp
    const minutes = Math.floor((now - timestamp) / 60000) // Calculate the difference in minutes
    return minutes === 0 ? 'Just now' : `${minutes} minute${minutes > 1 ? 's' : ''} ago` // Return the formatted time
  }

  /**
   * Countdown timer that updates the remaining time for the toast until it expires.
   * @param {number} expiryTime - The time when the toast will expire.
   * @param {boolean} isHovered - A flag indicating whether the toast is being hovered over.
   * @returns {JSX.Element|null} - A countdown timer element or null if the countdown has finished.
   */
  const Countdown = ({ expiryTime, isHovered }) => {
    const [remainingTime, setRemainingTime] = useState(Math.ceil((expiryTime - Date.now()) / 1000)) // Initialize the remaining time in seconds

    useEffect(() => {
      if (isHovered || remainingTime <= 0) return // Freeze the countdown if hovered or if time is 0

      // Update the remaining time every second
      const interval = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1)) // Decrease remaining time
      }, 1000)

      // Cleanup the interval when the component unmounts or when remainingTime changes
      return () => clearInterval(interval)
    }, [isHovered, remainingTime])

    if (remainingTime <= 0) return null // If time is 0 or less, don't show the countdown

    return <small className="ms-2">({remainingTime}s)</small> // Return the countdown timer element
  }

  return (
    <AppContext.Provider value={{ addToast }}>
      <CToaster className="position-fixed bottom-0 end-0 p-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="c-toast-stack"
            onMouseEnter={() => {
              clearRemovalTimeout(toast.id) // Clear the removal timeout when the toast is hovered
              setToasts(
                (prev) => prev.map((t) => (t.id === toast.id ? { ...t, isHovered: true } : t)), // Set the toast as hovered
              )
            }}
            onMouseLeave={() => {
              resetRemovalTimeout(toast.id) // Reset the removal timeout when the hover ends
              setToasts(
                (prev) => prev.map((t) => (t.id === toast.id ? { ...t, isHovered: false } : t)), // Set the toast as not hovered
              )
            }}
          >
            <CToast visible={toast.visible} color={toast.color} delay={milliseconds}>
              <CToastHeader>
                <span className="d-flex items-content-center text-capitalize">{toast.title}</span>
                <div className="ms-auto d-flex items-content-center">
                  {/* <small className="text-muted">{toast.id} {" | "}</small> */}
                  <CSpinner color={toast.color} size="sm" variant="grow" className="me-2" />
                  <small>{timeAgo(toast.id)}</small>
                  <Countdown expiryTime={toast.expiryTime} isHovered={toast.isHovered} />
                  <CToastClose onClick={() => removeToast(toast.id)} />
                </div>
              </CToastHeader>
              <CToastBody className="text-capitalize">
                <div>{toast.message}</div>
                <div className="mt-2 d-flex justify-content-end">
                  {toast.action && (
                    <CButton onClick={toast.action} className="btn btn-sm btn-outline-light">
                      {toast.actionLabel}
                    </CButton>
                  )}
                </div>
              </CToastBody>
            </CToast>
          </div>
        ))}
      </CToaster>
      {children}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: propTypes.node.isRequired,
}

export default AppProvider
