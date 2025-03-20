import React from 'react'
import { CFooter } from '@coreui/react'
import { config } from '../config'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>Axleshift HR 2&nbsp;&copy;&nbsp;2024</div>
      <div className="ms-auto">
        {config.env === 'development' && <div className="text-muted">Developer Build</div>}
        <div className="text-muted">
          <span>Version: {config.appVersion}</span>
        </div>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
