import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
    return (
        <CFooter className="px-4">
            <div>Axleshift HR 2&nbsp;&copy;&nbsp;2024</div>
            <div className="ms-auto"></div>
        </CFooter>
    )
}

export default React.memo(AppFooter)