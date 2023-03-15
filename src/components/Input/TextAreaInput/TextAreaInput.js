import React from 'react'
import { CFormTextarea } from '@coreui/react'

const TextAreaInput = (props) => {
  const { name, errors, label, register, rules, disabled, value, ...otherProps } = props
  const { required } = rules

  const renderDisabled = () => (
    <div className="mt-4">
      <span>
        {label}
        {required && <small className="ml-1">*</small>}
      </span>
      <CFormTextarea className="mt-1" rows="3" {...otherProps} value={value} disabled />
    </div>
  )

  const renderInputables = () => (
    <div className="mt-4">
      <span>
        {label}
        {required && <small className="ml-1">*</small>}
      </span>
      <CFormTextarea className="mt-1" rows="3" {...otherProps} name {...register(name, rules)} />
      {errors[name] && <small>{errors[name].message}</small>}
    </div>
  )

  return <>{disabled ? renderDisabled() : renderInputables()}</>
}

export default TextAreaInput
