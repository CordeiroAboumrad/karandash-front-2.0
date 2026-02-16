import BrMessage from '../../components/BrMessage'

import type { BrValidationState } from './notificationsHelper'
import { ToastBar, Toaster, toast } from 'react-hot-toast'

const NotificationsManager = () => {
  return (
    <Toaster>
      {(t) => (
        <ToastBar toast={t} style={{ padding: 0, minWidth: '100%' }}>
          {() => (
            <div style={{ minWidth: '100%' }}>
              <BrMessage
                state={t.icon as BrValidationState}
                message={t.message?.toString()}
                onClose={() => toast.dismiss(t.id)}
                noMargin
              />
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}

export default NotificationsManager
