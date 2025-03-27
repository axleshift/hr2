import React from 'react'
import { CCol, CContainer, CRow, CButton } from '@coreui/react'

const goBack = () => {
  window.history.back()
}

const PolicyTerms = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <div className="auth-bg" />
      <CContainer>
        <CRow className="justify-content-center mt-5">
          <CCol md={8} lg={9} xl={10} className="mt-5">
            <h1 className="display-4 text-white">Terms of Service & Privacy Policy</h1>
            <p className="text-white">Last Updated: Mon, Mar 27 2025</p>

            <p className="lead text-white">
              By accessing or using our services, you agree to comply with these Terms and our
              Privacy Policy. If you do not agree, please do not use our services.
            </p>

            <div className="mb-3">
              <h3>Acceptance of Terms</h3>
              <p>
                By using our services, you accept these Terms in full. If you disagree with any
                part, you must not use our services.
              </p>
            </div>

            <div className="mb-3">
              <h3>Modifications</h3>
              <p>
                We reserve the right to modify these Terms and Privacy Policy at any time. Changes
                will be posted on this page.
              </p>
            </div>

            <div className="mb-3">
              <h3>User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account. You agree
                to use our services lawfully.
              </p>
            </div>

            <div className="mb-3">
              <h3>Intellectual Property</h3>
              <p>
                All content is the exclusive property of Axleshift HR 2 and protected by
                intellectual property laws.
              </p>
            </div>

            <div className="mb-3">
              <h3>Limitation of Liability</h3>
              <p>
                Axleshift HR 2 is not liable for any damages arising from the use of our services.
              </p>
            </div>

            <div className="mb-3">
              <h3>Governing Law</h3>
              <p>These Terms are governed by the laws of the Philippines.</p>
            </div>

            <h2 className="text-white mt-4">Privacy Policy</h2>
            <p className="lead text-white">
              Your privacy is important to us. This section outlines how we handle your data.
            </p>

            <div className="mb-3">
              <h3>Information We Collect</h3>
              <h5>Personal Information:</h5>
              <p>We collect your name, email, and other details you provide.</p>

              <h5>Usage Data:</h5>
              <p>We collect data such as IP address, browser type, and access times.</p>
            </div>

            <div className="mb-3">
              <h3>How We Use Your Information</h3>
              <ul>
                <li>To provide and improve our services</li>
                <li>To communicate with you about your account and services</li>
                <li>To process transactions and send confirmations</li>
              </ul>
            </div>

            <div className="mb-3">
              <h3>Data Security</h3>
              <p>We implement security measures but cannot guarantee 100% security.</p>
            </div>

            <div className="mb-3">
              <h3>AI-Driven Resume Screening</h3>
              <p>
                We use AI to analyze and assess job applications, helping us efficiently match
                candidates with job opportunities based on relevant skills and qualifications.
              </p>
              <p>
                <strong>Automated Decision-Making & Your Rights:</strong>
              </p>
              <ul>
                <li>You have the right to request human review of AI-based decisions.</li>
                <li>You may challenge decisions made solely by AI.</li>
                <li>You can request an explanation of how your data was used in the AI process.</li>
              </ul>
            </div>

            <div className="mb-3">
              <h3>GDPR Compliance</h3>
              <ul>
                <li>You have the right to access, correct, or delete your data.</li>
                <li>You may request data portability.</li>
                <li>You can withdraw consent at any time.</li>
                <li>
                  For inquiries, contact us at{' '}
                  <a href="mailto:hr2axleshift@gmail.com">hr2axleshift@gmail.com</a>.
                </li>
              </ul>
            </div>

            <div className="mb-3">
              <h3>Sharing Your Information</h3>
              <p>
                We do not sell your data. We share it only with trusted partners under
                confidentiality agreements.
              </p>
            </div>
          </CCol>
        </CRow>

        <CRow className="mb-3">
          <CCol className="text-center">
            <CButton color="primary" onClick={goBack}>
              Go Back
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default PolicyTerms
