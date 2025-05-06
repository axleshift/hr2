import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Document, Page, pdfjs } from 'react-pdf'
import { 
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CSpinner,
  CButton,
  CAlert,
  CContainer,
  CRow,
  CCol
} from '@coreui/react'
import { getFile } from '../api/axios'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewerModal = ({ isVisible, onClose, url, width = 600 }) => {
  const [pdfData, setPdfData] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch PDF on mount
  useEffect(() => {
    if (!isVisible || !url) return
  
    const fetchPdf = async () => {
      setLoading(true);
      setError(null);
      setPdfData(null);
    
      try {
        const response = await getFile(url, { responseType: 'arraybuffer' });
        if (response?.data) {
          const buffer = new Uint8Array(response.data);
          setPdfData(buffer);
        } else {
          setError(new Error(response?.message || 'Unknown error fetching PDF'));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPdf()
  }, [url, isVisible])

  const memoizedFile = useMemo(() => ({ data: pdfData }), [pdfData]);
  
  // Called when PDF is loaded by react-pdf
  const onDocumentLoadSuccess = ({ numPages: loadedPages }) => {
    setNumPages(loadedPages)
    setPageNumber(1)
  }

  // Navigation handlers
  const goToPrev = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNext = () => setPageNumber((prev) => Math.min(prev + 1, numPages))

  return (
    <CModal visible={isVisible} size="lg" onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>PDF Viewer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loading && (
          <div className="text-center my-4">
            <CSpinner /> Fetching document...
          </div>
        )}
        {error && (
          <CAlert color="danger">
            Error loading PDF: {error.message}
          </CAlert>
        )}
        {pdfData && !loading && (
          <>
            <CContainer>
              <CRow className="mb-2 align-items-center">
                <CCol xs="auto">
                  <CButton 
                    color="outline-primary" 
                    size="sm" 
                    onClick={goToPrev} 
                    disabled={pageNumber <= 1}
                  >Prev</CButton>
                </CCol>
                <CCol className="text-center">
                  Page {pageNumber} of {numPages || '--'}
                </CCol>
                <CCol xs="auto" className="text-end">
                  <CButton 
                    color="outline-primary" 
                    size="sm" 
                    onClick={goToNext} 
                    disabled={pageNumber >= numPages}
                  >Next</CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol className='d-flex justify-content-center'>
                  <Document
                    file={memoizedFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="text-center">
                        <CSpinner /> Loading pages...
                      </div>
                    }
                    error={
                      <CAlert color="danger">
                        Failed to render document.
                      </CAlert>
                    }
                  >
                    <Page pageNumber={pageNumber} width={width} />
                  </Document>
                </CCol>
              </CRow>
            </CContainer>
          </>
        )}
      </CModalBody>
    </CModal>
  )
}

PdfViewerModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  width: PropTypes.number,
}

export default PdfViewerModal
