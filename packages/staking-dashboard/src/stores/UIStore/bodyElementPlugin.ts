import * as mobx from 'mobx'

/**
 * Automatically set props on the html element or body element depending on observables
 */
function register(uiStore: { theme: 'light' | 'dark' }) {
  mobx.autorun(
    () => {
      const html = window.document.querySelector('html')!
      html.setAttribute('theme', uiStore.theme)
    },
    { name: 'autoUpdateBodyElement' }
  )
}

export default {
  register
}
