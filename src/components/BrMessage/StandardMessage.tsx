import classNames from 'classnames'

import { MessageIcon } from './constants'
import type { BrMessageProps } from '.'
import Icon from '../Icon'

const StandardMessage = (props: BrMessageProps) => {
  const { state, message, title, inlineTitle, onClose, noMargin } = props

  const rootClasses = classNames('br-message', state, noMargin && 'm-0')

  const MessageWrapper = inlineTitle ? 'span' : 'div'

  return (
    <div className={rootClasses}>
      <div className="icon">
        <Icon src={MessageIcon[state]} size="lg" />
      </div>
      <div className="content py-3" role="alert">
        {title && (
          <span className="message-title">
            {inlineTitle ? `${title} ` : title}
          </span>
        )}
        <MessageWrapper className="message-body">{message}</MessageWrapper>
      </div>
      {onClose && (
        <div className="close">
          <button aria-label="fechar a mensagem de alerta" onClick={onClose}>
            <span className="fa-solid fa-times-circle" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

export default StandardMessage
