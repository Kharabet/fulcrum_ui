import Clipboard from 'clipboard'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as IconCopy } from '../assets/images/ic__copy.svg'

export interface ICopyToClipboardProps {
  children: string
}

const CopyToClipboard = (props: ICopyToClipboardProps) => {
  const copyEl = React.useRef<HTMLSpanElement | null>(null)
  let clipboard: Clipboard | undefined

  useEffect(() => {
    if (copyEl.current !== null && !clipboard) {
      clipboard = new Clipboard(copyEl.current)
      clipboard.on('success', (e) => {
        if (!copyEl.current) {
          return
        }
        copyEl.current.dataset.tip = 'Copied!'
        ReactTooltip.show(copyEl.current)
        window.setTimeout(() => ReactTooltip.hide(copyEl.current), 1000)
        e.clearSelection()
      })
      clipboard.on('error', (e) => {
        if (!copyEl.current) {
          return
        }
        copyEl.current.dataset.tip = 'Copy failed!'
        ReactTooltip.show(copyEl.current)
        window.setTimeout(() => ReactTooltip.hide(copyEl.current), 1000)
      })
    }
    return () => {
      if (clipboard) {
        clipboard.destroy()
      }
    }
  })

  return (
    <React.Fragment>
      <span
        className="clipboard__id-copy"
        ref={copyEl}
        data-clipboard-text={props.children}
        data-for={props.children}>
        <IconCopy />
      </span>
      <ReactTooltip className="tooltip__info" id={props.children} event="fakeEvent" />
    </React.Fragment>
  )
}

export default React.memo(CopyToClipboard)
