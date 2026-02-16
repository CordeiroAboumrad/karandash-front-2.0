export type BrValidationState = 'success' | 'info' | 'warning' | 'danger'

export const MessageState = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
} as const

export type MessageState = typeof MessageState[keyof typeof MessageState]

export const MessageIcon: Record<MessageState, string> = {
  success: 'check-circle',
  info: 'info-circle',
  warning: 'exclamation-triangle',
  danger: 'times-circle',
}
