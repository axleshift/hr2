import React from 'react'
import { CCol, CContainer, CRow, CButton } from '@coreui/react'

const goBack = () => {
  window.history.back()
}

const Terms = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <div className="auth-bg" />
      <CContainer>
        <CRow className="justify-content-center mt-5">
          <CCol md={8} lg={9} xl={10} className="mt-5">
            <h1 className="display-4 text-white">Privacy Policy</h1>
            Last Updated: Mon, Oct 21 2024
            <p className="lead text-white">
              At Axleshift HR 2, your privacy is important to us. This Privacy Policy outlines how
              we collect, use, and protect your information.
            </p>
            <div className="mb-3">
              <h3>Information We Collect</h3>
              <div className="ms-3">
                <h5>Personal Information:</h5>
                We may collect personal information that you provide directly to us, such as your
                name, email address, and payment information.
                <div className="mb-3" />
                <h5>Usage Data:</h5>
                We may collect information about how you use our services, including IP address,
                browser type, and access times.
                <div className="mb-3" />
                <h5>How We Use Your Information We use your information to:</h5>
                Provide and improve our services. Communicate with you about your account and our
                services. Communicate with you about your account and our services. Process
                transactions and send you confirmations.
              </div>
            </div>
            <div className="mb-3">
              <h3>Data Security</h3>
              We implement reasonable security measures to protect your information. However, no
              method of transmission over the internet or method of electronic storage is 100%
              secure.
            </div>
            <div className="mb-3">
              <h3> Sharing Your Information</h3>
              We do not sell or rent your personal information to third parties. We may share your
              information with trusted partners who assist us in operating our services, as long as
              those parties agree to keep your information confidential.
            </div>
            <div className="mb-3">
              <h3>Your Rights</h3>
              Depending on your location, you may have certain rights regarding your personal
              information, including the right to access, correct, or delete your information.
            </div>
            <div className="mb-3">
              <h3> Changes to This Privacy</h3>
              Policy We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page.
            </div>
            <div className="mb-3">
              <h3> Contact Information</h3>
              For any questions about these Terms, please contact us at hr2axleshift@gmail.com.
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol className="text-center">
            <button className="btn btn-link" onClick={goBack}>
              Go Back
            </button>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Terms
