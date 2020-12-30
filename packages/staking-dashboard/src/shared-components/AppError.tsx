import { observer } from 'mobx-react'
import React from 'react'
import { RootStore } from 'src/stores'
import { ButtonBasic } from 'ui-framework'

export function AppError({ rootStore }: { rootStore: RootStore }) {
  const { appError } = rootStore

  return (
    <div className={appError === null ? 'app-error' : 'app-error--visible'}>
      {appError !== null && (
        <div className="flex-row">
          <div className="flex-fill margin-right-1">
            <h3>
              <small>Error: {appError.error.title || appError.error.message}</small>
            </h3>
            <textarea
              className="app-error__message"
              defaultValue={appError.stackMessages}
              readOnly={true}
            />
          </div>
          <ButtonBasic className="btn--link" onClick={rootStore.clearError}>
            Close
          </ButtonBasic>
        </div>
      )}
    </div>
  )
}

export default observer(AppError)
