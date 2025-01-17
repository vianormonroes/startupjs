import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Tag from './../../Tag'
import './index.styl'

function DefaultTag ({ index, record }) {
  return pug`
    Tag(
      pushed=index !== 0
      variant='flat'
      color='primary'
    )= record.label
  `
}

DefaultTag.propTypes = {
  index: PropTypes.number,
  record: PropTypes.object
}

export default observer(DefaultTag)
