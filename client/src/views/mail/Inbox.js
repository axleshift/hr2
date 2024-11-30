import { CContainer, CRow, CCol, CListGroup, CListGroupItem, CSpinner } from '@coreui/react'
import React from 'react'
import { formatDate, trimString, UTCDate } from '../../utils'
import { get } from '../../api/axios'
import AppPagination from '../../components/AppPagination'

const Inbox = () => {
  const [defaultDate, setDefaultDate] = React.useState(UTCDate(new Date()))
  const [Inboxes, setInboxes] = React.useState([
    {
      _id: 1,
      to: ['user1', 'user2'],
      subject: 'Message 1',
      content: 'This is the content of Message 1',
      isRead: false,
    },
    {
      _id: 2,
      to: ['user1', 'user2'],
      subject: 'Message 2',
      content: 'This is the content of Message 2',
      isRead: true,
    },
    {
      _id: 3,
      to: ['user1', 'user2'],
      subject: 'Message 3',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et minima laboriosam quae beatae, tenetur tempore dignissimos voluptatum. Ea nam doloribus soluta rem. Quasi alias temporibus, error facere ad minima optio.',
      isRead: false,
    },
  ])

  const [selectedItem, setSelectedItem] = React.useState(null)
  const [isMailFormVisible, setMailFormVisible] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)

  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  const getAllInboxes = async () => {
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
    getAllInboxes()
  }, [])
  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Inbox</h2>
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
                Inboxes.map((item) => (
                  <CListGroupItem
                    key={item._id}
                    as="button"
                    onClick={() => {
                      setSelectedItem(item)
                    }}
                    className="d-flex justify-content-between"
                  >
                    <div>
                      <strong>{item.subject}</strong>
                      <br />
                      <p>{trimString(item.content, 50)}</p>
                      <div className="d-flex justify-content-between">
                        <small>
                          {item.to.length > 1
                            ? `${item.to[0]} and ${item.to.length - 1} others`
                            : `${item.to[0]} Recipient`}
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
      </CContainer>
    </>
  )
}

export default Inbox
