import React from 'react'
import { CFooter } from '@coreui/react'
import { config } from '../config'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>Axleshift HR 2&nbsp;&copy;&nbsp;2024</div>
      <div className="ms-auto">
        <small>
          <span className="text-muted me-1">
            {config.env === 'development' && 'Dev Build'}&nbsp;
            {config.appVersion}
          </span>
        </small>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
