import InputLabelMui from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import {
  CheckboxElement,
  PasswordElement,
  PasswordElementProps,
  TextFieldElement,
  TextFieldElementProps,
} from 'react-hook-form-mui'
import React from 'react'
import { FieldValues } from 'react-hook-form/dist/types/fields'

export const Input = (props: TextFieldElementProps) => (
  <TextFieldElement variant="outlined" {...props} />
)
export const Password = (props: PasswordElementProps<FieldValues>) => (
  <PasswordElement variant="outlined" {...props} />
)
export const InputMui = (props: any) => <TextField variant="outlined" {...props} />
export const InputLabel = (props: any) => <InputLabelMui variant="outlined" {...props} />
export const CheckboxHookForm = (props: any) => <CheckboxElement {...props} />
