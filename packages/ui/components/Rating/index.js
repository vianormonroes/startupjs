import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import Row from './../Row'
import H6 from './../typography/H6'
import Star from './Star'
import './index.styl'
const AMOUNT = 5
const ITEMS = Array(AMOUNT).fill(null)

function Rating ({
  style,
  value,
  readonly,
  onChange
}) {
  return pug`
    Row(style=style vAlign='center')
      if readonly
        Star(active)
        H6.value(bold)= value.toFixed(1)
      else
        each ITEM, index in ITEMS
          Div.star(
            key=index
            onPress=() => onChange && onChange(index + 1)
            styleName={first: index === 0}
          )
            Star(active=index < Math.round(value))
  `
}

Rating.defaultProps = {
  value: 0,
  readonly: false
}

Rating.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.number,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

export default observer(Rating)
