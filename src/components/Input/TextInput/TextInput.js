import React from 'react'
import { CFormInput } from '@coreui/react'

const TextInput = (props) => {
  const {
    name,
    errors,
    label,
    subtitle,
    register,
    rules,
    disabled = false,
    value = '',
    ...otherProps
  } = props
  const { required } = rules

  const renderDisabledInput = () => (
    <div className="mt-2">
      <span>
        {label}
        {required && <small className="ml-1 text-danger">*</small>}
      </span>
      <CFormInput className="mt-1" value={value} disabled {...otherProps} />
    </div>
  )

  const renderInputables = () => (
    <div className="mt-2">
      <span>
        {label}
        {required && <small className="ml-1 text-danger">*</small>}
      </span>
      <br></br>
      {subtitle && (
        <>
          <small className="text-gray-500">{subtitle}</small>
        </>
      )}
      <CFormInput className="mt-1" name={name} {...otherProps} {...register(name, rules)} />
      {errors[name] && <small className="text-danger">{errors[name].message}</small>}
    </div>
  )

  return <>{disabled ? renderDisabledInput() : renderInputables()}</>
}

export default TextInput
