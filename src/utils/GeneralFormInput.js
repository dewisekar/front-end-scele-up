import React, { useState, useRef, useEffect } from 'react'
import { CFormInput } from '@coreui/react'

const GeneralFormInput = React.memo(function GeneralFormInput(props) {
  const { type, placeholder, value, onChange, ...rest } = props
  const ref = useRef(null)
  const [cursor, setCursor] = useState(null)
  // useEffect(() => {
  //   const input = ref.current
  //   console.log('input:', input, ',value:', value, ',cursor:', cursor)
  //   if (input) input.focus() //input.setSelectionRange(cursor, cursor)
  // }, [ref, cursor, value])

  let regexInput = props.regexInput == null ? null : props.regexInput
  const handleChange = (e) => {
    if (regexInput != null) {
      if (e.target.value === '' || regexInput.test(e.target.value)) {
        setCursor(e.target.selectionStart)
        onChange && onChange(e)
        ref.current.focus()
      }
    } else {
      setCursor(e.target.selectionStart)
      onChange && onChange(e)
      ref.current.focus()
    }
  }

  return (
    <CFormInput
      ref={ref}
      type={type}
      placeholder={placeholder} //"Input uername KOL"
      aria-label="default input example"
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
})

export default GeneralFormInput
