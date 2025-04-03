import React from 'react'
import PropTypes from 'prop-types'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react'

const ConfirmationDialog = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor,
}) => {
  return (
    <CModal visible={isVisible} onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{message}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" size="sm" onClick={onClose}>
          {cancelText || 'Cancel'}
        </CButton>
        <CButton color={confirmColor || 'danger'} size="sm" onClick={onConfirm}>
          {confirmText || 'Confirm'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ConfirmationDialog.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
}

export default ConfirmationDialog
