import toast from 'react-hot-toast'

export type BrValidationState = 'success' | 'info' | 'warning' | 'danger'

export type NotificationProps = {
  state: BrValidationState
  message: string
  duration?: number
}

export const pushNotification = ({
  state,
  message,
  duration = 5000,
}: NotificationProps) => {
  toast(message, { duration, icon: state })
}

export const pushApiNotification = ({ state, message }: NotificationProps) => {
  toast(message, { duration: 5000, icon: state })
}

export const clearNotifications = () => {
  toast.dismiss()
}
