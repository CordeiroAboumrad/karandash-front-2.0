import classNames from "classnames";

import Icon from "../Icon";

import { MessageIcon } from "./constants";

import type { BrMessageProps } from ".";

const FeedbackMessage = ({ state, message }: BrMessageProps) => {
  const classes = classNames("feedback", state);

  return (
    <span className={classes} role="alert">
      <Icon src={MessageIcon[state]} />
      {message}
    </span>
  );
};

export default FeedbackMessage;
