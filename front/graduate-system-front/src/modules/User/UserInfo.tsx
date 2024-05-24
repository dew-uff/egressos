import { Subtitle } from '@styles/index.style'
import {
  Divider,
  FormHelperText,
  Input,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  SelectMui as Select,
  CheckboxHookForm,
} from '@components'
import { Controller, useController } from 'react-hook-form'
import { Role, RoleTranslation } from '@utils/enums'
import React from 'react'

const getEmailErrorMessageByType = (type: string) => {
  switch (type) {
    case 'pattern':
      return 'Insira um e-mail válido.'
    case 'required':
      return 'Digite o e-mail.'
    default:
      return 'Campo inválido.'
  }
}

const getNameErrorMessageByType = (type: string) => {
  switch (type) {
    case 'required':
      return 'Digite o nome.'
    default:
      return 'Campo inválido.'
  }
}
const UserInfo = ({ control }) => {
  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })
  const {
    field: { value: userRoles },
  } = useController({ control, name: 'user.roles' })

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>Informações do Usuário</Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input
                required
                name={'user.name'}
                label={'Nome'}
                parseError={({ type }) => getNameErrorMessageByType(type)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Input
                parseError={({ type }) => getEmailErrorMessageByType(type)}
                type={'email'}
                required
                name={'user.email'}
                label={'E-mail'}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor={'user.roles'}>Papel do Usuário</InputLabel>
              <Controller
                control={control}
                name={'user.roles'}
                rules={{ required: true }}
                render={({
                  field: { onChange, onBlur, name, value, ref },
                  fieldState: { invalid },
                }) => (
                  <>
                    <Select
                      error={invalid}
                      multiple
                      onChange={onChange}
                      onBlur={onBlur}
                      name={name}
                      id={'user.roles'}
                      value={value ?? []}
                      ref={ref}
                      label={'Papel do Usuário'}
                    >
                      {roles.map(role => (
                        <MenuItem key={role} value={role}>
                          {RoleTranslation[role]}
                        </MenuItem>
                      ))}
                    </Select>
                    {invalid && (
                      <FormHelperText error={invalid}>Selecione algum papel.</FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>
          </Grid>
          {userRoles.includes(Role.ADMIN) && (
            <Grid item xs={6}>
              <CheckboxHookForm
                name="user.sendEmailToAdminOnSave"
                label="Receber e-mail quando histórico de egressos for atualizado."
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserInfo
