import { CContainer, CCard, CCardBody, CButton } from '@coreui/react'
import { AppContext } from '../../context/appContext'
import { useEffect, useState, useContext } from 'react'
import { get } from '../../api/axios'

import React from 'react'

const TestPage = () => {
  const { addToast } = useContext(AppContext)
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  const randomColor = () => {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleClick = async () => {
    const c = randomColor()
    const res = await get('/test/')
    if (res.status === 200) {
      addToast('Test', lorem, c, alertMsg, 'Try Again')
    } else {
      addToast('Test', 'Test route is not working', 'error')
    }
  }

  const alertMsg = () => {
    const c = randomColor()
    addToast('Test', 'This is a callback', c)
  }

  return (
    <>
      <CContainer>
        <CCard>
          <CCardBody>
            <small> This button check the /test route of api</small>
            <br />
            <CButton onClick={handleClick} className="btn btn-primary">
              Add Toast
            </CButton>
          </CCardBody>
        </CCard>
      </CContainer>
    </>
  )
}

export default TestPage
