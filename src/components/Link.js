import React from 'react'
import PropTypes from 'prop-types'

Link.propTypes = {
  link: PropTypes.shape({
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}

export default function Link(props) {
  return (
    <div>
      <div>
        {props.link.description} ({props.link.url})
      </div>
    </div>
  )
}
