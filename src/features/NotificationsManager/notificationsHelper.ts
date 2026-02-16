import toast from 'react-hot-toast'

export type BrValidationState = 'success' | 'info' | 'warning' | 'danger'

export type NotificationProps = {
  state: BrValidationState
  message: string
  duration?: number
}

export const pushNotification = ({ state, message, duration = 5_000 }: NotificationProps) => {
  toast(message, { icon: state, duration })
}

export const pushApiNotification = ({ state, message }: NotificationProps) => {
  toast(message, { icon: state, duration: 10_000 })
}

export const clearNotifications = () => {
  toast.dismiss()
}
