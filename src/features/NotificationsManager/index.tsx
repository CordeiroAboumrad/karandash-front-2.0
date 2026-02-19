import { ToastBar, Toaster, toast } from "react-hot-toast";

import BrMessage from "../../components/BrMessage";

import type { BrValidationState } from "./notificationsHelper";

const NotificationsManager = () => {
  return (
    <Toaster>
      {(t) => {
        const state = (typeof t.icon === 'string' ? t.icon : 'danger') as BrValidationState
        return (
          <ToastBar toast={t} style={{ padding: 0, minWidth: "100%" }}>
            {() => (
              <div style={{ minWidth: "100%" }}>
                <BrMessage
                  state={state}
                  message={t.message?.toString()}
                  onClose={() => toast.dismiss(t.id)}
                  noMargin
                />
              </div>
            )}
          </ToastBar>
        )
      }}
    </Toaster>
  );
};

export default NotificationsManager;
