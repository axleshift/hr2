import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import App from '../src/App'
import AuthProvider from '../src/context/authContext'
import AppProvider from '../src/context/appContext'
import '@testing-library/jest-dom'
import PropTypes from 'prop-types'

const mockStore = configureStore([])

const TestWrapper = ({ children, store }) => (
  <Provider store={store}>
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  </Provider>
)

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.object.isRequired,
}

describe('App Component', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      theme: 'light',
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
      },
    })
  })

  test('renders loading spinner initially', () => {
    render(
      <TestWrapper store={store}>
        <App />
      </TestWrapper>,
    )

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()

    const loadingText = screen.getByText('Loading...')
    expect(loadingText).toBeInTheDocument()
  })
})
