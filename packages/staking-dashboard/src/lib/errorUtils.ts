/**
 * Add extra props to errors that are useful
 * @param error
 * @param opts
 */
function decorateError(error: Error, opts: { title?: string } = {}) {
  if (opts.title) {
    ;(error as any).title = opts.title
  }
  if (/user.denied/i.test(error.message)) {
    ;(error as any).title = 'The transaction was canceled or denied.'
    ;(error as any).noError = true
  }
  return error
}


/**
 * Creates a more human readable error message from the entire stack
 */
function getErrorStackMessages (error: any, message = ''): string {
  if (error.message) {
    const stringyfied = /"message":"(.+?)"/gm.exec(error.message)
    message += stringyfied ? stringyfied[1] : error.message
    if (error.code) {
      message += ` (${error.code})`
    }
    message += '\n'
  }
  if (!error.data) {
    return message
  }
  return getErrorStackMessages(error.data, message)
}

export default {
  decorateError,
  getErrorStackMessages
}
