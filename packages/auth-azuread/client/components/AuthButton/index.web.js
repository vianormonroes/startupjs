import React from 'react'
import { observer } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons'
import { onLogin } from '../../helpers'
import './index.styl'

function AuthButton ({ label, redirectUrl }) {
  return pug`
    Button.button(
      onPress=() => onLogin(redirectUrl)
      icon=faMicrosoft
      variant='flat'
    )= label
  `
}

AuthButton.defaultProps = {
  label: 'Azure AD'
}

AuthButton.propTypes = {
  label: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string
}

export default observer(AuthButton)
