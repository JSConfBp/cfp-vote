import React from 'react'
import FieldPicker from '../FieldPicker'

export default ({ fields, next }) => (<>
  <FieldPicker
    fields={ fields }
    onHasFields={ data => next(data) } />
  </>)
