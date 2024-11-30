import { CContainer, CRow, CCol, CListGroup, CListGroupItem, CSpinner } from '@coreui/react'
import React from 'react'
import { formatDate, trimString, UTCDate } from '../../utils'
import { get } from '../../api/axios'
import AppPagination from '../../components/AppPagination'

import MailForm from './modals/mailForm'

const Drafts = () => {
  const [defaultDate, setDefaultDate] = React.useState(UTCDate(new Date()))
  const [drafts, setDrafts] = React.useState([
    {
      _id: 1,
      to: ['user1', 'user2'],
      subject: 'Draft 1',
      content: 'This is the content of Draft 1',
      isRead: false,
    },
    {
      _id: 2,
      to: ['user1', 'user2'],
      subject: 'Draft 2',
      content: 'This is the content of Draft 2',
      isRead: true,
    },
    {
      _id: 3,
      to: ['user1', 'user2'],
      subject: 'Draft 3',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et minima laboriosam quae beatae, tenetur tempore dignissimos voluptatum. Ea nam doloribus soluta rem. Quasi alias temporibus, error facere ad minima optio.',
      isRead: false,
    },
  ])

  const [selectedDraft, setSelectedDraft] = React.useState(null)
  const [isMailFormVisible, setMailFormVisible] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)

  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  const getAllDrafts = async () => {
    setLoading(true)
    try {
      // const res = await get('/drafts')
      // setDrafts(res.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  React.useEffect(() => {
    getAllDrafts()
  }, [])
  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Drafts </h2>
            <small>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et minima laboriosam quae
              beatae, tenetur tempore dignissimos voluptatum. Ea nam doloribus soluta rem. Quasi
              alias temporibus, error facere ad minima optio.
            </small>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CListGroup>
              {isLoading ? (
                <CListGroupItem className="text-center">
                  <CSpinner color="primary" variant="grow" />
                </CListGroupItem>
              ) : (
                drafts.map((draft) => (
                  <CListGroupItem
                    key={draft._id}
                    as="button"
                    onClick={() => {
                      setSelectedDraft(draft)
                      setMailFormVisible(true)
                    }}
                    className="d-flex justify-content-between"
                  >
                    <div>
                      <strong>{draft.subject}</strong>
                      <br />
                      <p>{trimString(draft.content, 50)}</p>
                      <div className="d-flex justify-content-between">
                        <small>
                          {draft.to.length > 1
                            ? `${draft.to[0]} and ${draft.to.length - 1} others`
                            : `${draft.to[0]} Recipient`}
                        </small>
                      </div>
                    </div>
                    <small className="text-muted">{formatDate(defaultDate, 'MMM DD, YYYY')}</small>
                  </CListGroupItem>
                ))
              )}
            </CListGroup>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <div className="d-flex justify-content-center">
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => console.log(page)}
              />
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <MailForm
              isVisible={isMailFormVisible}
              mailData={selectedDraft}
              onClose={() => {
                setSelectedDraft(null)
                setMailFormVisible(false)
              }}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Drafts
