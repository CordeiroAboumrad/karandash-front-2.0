import classNames from 'classnames'

import Icon from '../Icon'

import type { BrMessageProps } from '.'
import { MessageIcon } from './constants'

const FeedbackMessage = ({ state, message }: BrMessageProps) => {
  const classes = classNames('feedback', state)

  return (
    <span className={classes} role="alert">
      <Icon src={MessageIcon[state]} />
      {message}
    </span>
  )
}

export default FeedbackMessage
