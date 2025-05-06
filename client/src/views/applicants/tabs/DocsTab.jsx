import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CFormRange,
  CFormFeedback,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableFoot,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CListGroup,
  CListGroupItem,
  CTooltip,
} from '@coreui/react'

import Interviews from './Interviews'
import Screenings from './Screenings'
import Joboffers from './Joboffers'
import FilesTab from './FilesTab'

const DocsTab = ({ applicantId, applicantFiles, applicantInterviews }) => {
  return (
    <>
      <CContainer className="mt-3">
        <CRow>
          <CCol>
            <CTabs activeItemKey={'interview'}>
              <CTabList variant="tabs">
                <CTab itemKey={'interview'}>Interviews</CTab>
                <CTab itemKey={'screening'}>Screenings</CTab>
                <CTab itemKey={'joboffer'}>Job Offers</CTab>
                <CTab itemKey={'files'}>Files</CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel itemKey={'interview'}>
                  <Interviews applicantId={applicantId} />
                </CTabPanel>
                <CTabPanel itemKey={'screening'}>
                  <Screenings applicantId={applicantId} />
                </CTabPanel>
                <CTabPanel itemKey={'joboffer'}>
                  <Joboffers applicantId={applicantId} />
                </CTabPanel>
                <CTabPanel itemKey={'files'}>
                  <FilesTab
                    applicantId={applicantId}
                    files={applicantFiles}
                    interviews={applicantInterviews}
                  />
                </CTabPanel>
              </CTabContent>
            </CTabs>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

DocsTab.propTypes = {
  applicantId: propTypes.string,
  applicantFiles: propTypes.object,
  applicantInterviews: propTypes.object,
}

export default DocsTab
