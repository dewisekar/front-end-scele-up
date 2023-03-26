const formFields = [
  {
    name: 'username',
    label: 'Username',
    formType: 'input',
    rules: { required: { value: true, message: 'Wajib diisi' } },
  },
  {
    name: 'costPerSlot',
    label: 'Cost Per Slot',
    formType: 'input',
    rules: { required: { value: true, message: 'Wajib diisi' } },
  },
]

export { formFields }
