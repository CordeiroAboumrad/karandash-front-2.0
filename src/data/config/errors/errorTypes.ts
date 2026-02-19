import type { AxiosError } from 'axios'

import { pushApiNotification } from '../../../features/NotificationsManager/notificationsHelper'
import { ErrorRoutes } from '../../../router/routes'
import { redirectTo } from '../../../router/urlRedirectHelper'

export type ApiErrorData = {
  message?: string
  messages?: { message: string }[]
  detalhes?: { chave: string; mensagem: string }[]
  errorJson?: {
    detalhes?: { chave: string; mensagem: string }[]
    ticket?: string
  }
}

export type SdcApiErrorData = ApiErrorData | { message: string }[]

export const CLIENT_ERRORS = ['ERR_NETWORK', 'ERR_CANCELED']
const ERRO_INESPERADO = ['Ocorreu um erro inesperado.']
const NO_MESSAGE: string[] = []

export abstract class ApiAbstractError {
  private messages: string[]
  private action: (() => void) | undefined
  private navigation: string | undefined

  constructor(
    messages: string[],
    options?: { action?: () => void; navigation?: string }
  ) {
    this.messages = messages
    this.action = options?.action
    this.navigation = options?.navigation
  }

  public handleError() {
    this.messages.map((message) => {
      pushApiNotification({ state: 'danger', message })
    })
  }

  public handleRedirect() {
    if (this.navigation) {
      redirectTo(this.navigation)
    }
  }

  public handleAction() {
    if (this.action) {
      this.action()
    }
  }
}

export class ApiTicketError extends ApiAbstractError {
  constructor(error: AxiosError<ApiErrorData>) {
    const ticket = error.response?.data.errorJson?.ticket
    const messages = ticket
      ? [`Erro interno - Ticket #${ticket}`]
      : [error.message]
    super(messages)
  }
}

export class ApiAuthorizationError extends ApiAbstractError {
  constructor(error: AxiosError<ApiErrorData>) {
    const m = error.response?.data.message || 'Unauthorized'
    const navigation = '/login'
    const action = () => {
      localStorage.removeItem('bearerToken')
    }
    super([m], { navigation, action })
  }
}

export class ApiSdcError extends ApiAbstractError {
  constructor(error: AxiosError<SdcApiErrorData>) {
    const data = error.response?.data

    if (!data) {
      super(ERRO_INESPERADO)
    } else if (Array.isArray(data)) {
      super(data?.map((m) => m.message) ?? ERRO_INESPERADO)
    } else if (data.errorJson?.detalhes?.length) {
      const messages = data.errorJson.detalhes.map((e) => e.mensagem)
      super(messages)
    } else if (data.message) {
      super([data.message])
    } else {
      super(ERRO_INESPERADO)
    }
    return
  }
}

export class ApiUnexpectedError extends ApiAbstractError {
  constructor() {
    const navigation = `${ErrorRoutes.Unexpected}`

    super(NO_MESSAGE, { navigation })
  }
}
