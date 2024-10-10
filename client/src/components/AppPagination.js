import React from 'react'
import PropTypes from 'prop-types'
import { CPagination, CPaginationItem } from '@coreui/react'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 *
 * @param {currentPage} currentPage - The current page number
 * @param {totalPages} totalPages - The total number of pages
 * @param {onPageChange} onPageChange - The function to call when a page is clicked
 * @returns {JSX.Element} - The pagination component
 */

const AppPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Ensure currentPage defaults to 1 if totalPages is 0 or undefined
  // tbf this should never happen, but you know... just in case
  const effectiveCurrentPage = totalPages > 0 ? currentPage : 1

  const handlePageChange = (action) => {
    switch (action) {
      case 'firstPage':
        onPageChange(1)
        break
      case 'prevPage':
        if (effectiveCurrentPage > 1) {
          onPageChange(effectiveCurrentPage - 1)
        }
        break
      case 'nextPage':
        if (effectiveCurrentPage < totalPages) {
          onPageChange(effectiveCurrentPage + 1)
        }
        break
      case 'lastPage':
        onPageChange(totalPages)
        break
      default:
        console.warn('Unknown action:', action)
    }
  }

  // Render nothing if there are no pages
  if (totalPages === 0) {
    return <div>No data available</div>
  }

  return (
    <>
      <CPagination>
        <CPaginationItem
          onClick={() => handlePageChange('firstPage')}
          disabled={effectiveCurrentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </CPaginationItem>
        {effectiveCurrentPage > 3 && (
          <>
            <CPaginationItem onClick={() => onPageChange(1)}>1</CPaginationItem>
            <CPaginationItem disabled>...</CPaginationItem>
          </>
        )}
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1
          if (page >= effectiveCurrentPage - 2 && page <= effectiveCurrentPage + 2) {
            return (
              <CPaginationItem
                key={index}
                onClick={() => onPageChange(page)}
                active={effectiveCurrentPage === page}
              >
                {page}
              </CPaginationItem>
            )
          }
          return null
        })}
        {effectiveCurrentPage < totalPages - 2 && (
          <>
            {effectiveCurrentPage < totalPages - 3 && (
              <CPaginationItem disabled>...</CPaginationItem>
            )}
            <CPaginationItem onClick={() => onPageChange(totalPages)}>{totalPages}</CPaginationItem>
          </>
        )}
        <CPaginationItem
          onClick={() => handlePageChange('nextPage')}
          disabled={effectiveCurrentPage === totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </CPaginationItem>
      </CPagination>
    </>
  )
}

AppPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default AppPagination
// Idk what this does, but the rest of the other components have it
// So I'm just gonna leave it here
// export default React.memo(Pagination)
