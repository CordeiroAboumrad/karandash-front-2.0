import type { BrValidationState } from "../../features/NotificationsManager/notificationsHelper";

import ContextMessage from "./ContextMessage";
import StandardMessage from "./StandardMessage";

type MessageType = "standard" | "context";

export interface BrMessageProps {
  state: BrValidationState;
  message: React.ReactNode;
  variant?: MessageType;
  title?: string;
  inlineTitle?: boolean;
  onClose?: React.MouseEventHandler;
  noMargin?: boolean;
}

const MessageMap: Record<
  MessageType,
  (props: BrMessageProps) => React.JSX.Element
> = {
  standard: StandardMessage,
  context: ContextMessage,
};

const BrMessage = ({ variant = "standard", ...rest }: BrMessageProps) => {
  const Message = MessageMap[variant];

  return <Message {...rest} />;
};

export default BrMessage;
