import { observer } from 'mobx-react'
import React from 'react'
import { RootStore } from 'src/stores'
import { ButtonBasic } from 'ui-framework'
import { ReactComponent as CloseIcon } from 'app-images/ic__close.svg'

export function AppError({ rootStore }: { rootStore: RootStore }) {
  const { appError } = rootStore

  return (
    <div className={appError === null ? 'app-error' : 'app-error--visible'}>
      {appError !== null && (
        <div>
          <h3 className="app-error__title">
            <small>{appError.error.title || 'Error'}</small>
          </h3>
          {!appError.error.noError &&
            <textarea
              className="app-error__message"
              defaultValue={appError.stackMessages}
              readOnly={true}
            />
          }
          <ButtonBasic className="app-error__close btn--invisible" onClick={rootStore.clearError}>
            <CloseIcon title="Close"/>
          </ButtonBasic>
        </div>
      )}
    </div>
  )
}

export default observer(AppError)
