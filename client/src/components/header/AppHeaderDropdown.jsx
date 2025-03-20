import React, { useContext, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CSpinner,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuthContext } from '../../context/authContext'
import { AppContext } from '../../context/appContext'

import avatar8 from './../../assets/images/avatars/8.jpg'
import defaultAvatar from './../../../public/images/default-avatar.jpg'

const AppHeaderDropdown = () => {
  const { userInformation, logout } = useContext(AuthContext)
  const { addToast } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const handleLogout = () => {
    setIsLoading(true)
    logout((success) => {
      if (success) {
        addToast('Success', 'Logged out successfully', 'success')
        navigate('/login')
        setIsLoading(false)
      }
    })
  }
  return (
    <CDropdown variant="nav-item">
      {isLoading && (
        <div className="loading-overlay">
          <CSpinner color="primary" variant="grow" />
        </div>
      )}
      <CDropdownToggle placement="bottom-end" className="pe-0 py-0" caret={false}>
        <CAvatar src={defaultAvatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          {userInformation.username}
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={() => handleLogout()}>
          <FontAwesomeIcon icon={faSignOut} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
