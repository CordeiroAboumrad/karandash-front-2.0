import axios from 'axios'
import type { AxiosError } from 'axios'

import {
  type ApiAbstractError,
  ApiAuthorizationError,
  ApiTicketError,
  ApiUnexpectedError,
} from './errorTypes'
import type { ApiErrorData } from './errorTypes'

const ResponseErrorMap: Record<
  number,
  (e: AxiosError<ApiErrorData>) => ApiAbstractError
> = {
  401: (e) => new ApiAuthorizationError(e),
  500: (e) => new ApiTicketError(e),
}

export const apiErrorHandler = (err: unknown) => {
  if (!axios.isAxiosError(err)) {
    return new ApiUnexpectedError().handleRedirect()
  }

  if (err.response) {
    const handler =
      ResponseErrorMap[err.response.status](err) || new ApiUnexpectedError()

    handler.handleError()
    handler.handleAction()
    handler.handleRedirect()

    if (err.response.status === 401) {
      localStorage.removeItem('bearerToken')
    }

    throw err
  }
}
