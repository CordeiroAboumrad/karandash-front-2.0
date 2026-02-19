import toast from 'react-hot-toast'

export type BrValidationState = 'success' | 'info' | 'warning' | 'danger'

export type NotificationProps = {
  state: BrValidationState
  message: string
  duration?: number
}

const stateToToastMethod = {
  success: toast.success,
  info: toast,
  warning: toast,
  danger: toast.error,
}

export const pushNotification = ({
  state,
  message,
  duration = 5_000,
}: NotificationProps) => {
  const toastMethod = stateToToastMethod[state]
  toastMethod(message, { duration })
}

export const pushApiNotification = ({ state, message }: NotificationProps) => {
  const toastMethod = stateToToastMethod[state]
  toastMethod(message, { duration: 5000 })
}

export const clearNotifications = () => {
  toast.dismiss()
}
