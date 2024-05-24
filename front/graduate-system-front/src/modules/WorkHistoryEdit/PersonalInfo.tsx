import { Box, FormControl, Grid } from '@mui/material'
import { Subtitle } from './index.style'
import { Divider, Input } from '@components'
import React from 'react'
import { useAuth } from '@context/AuthProvider'
import { Role } from '@utils/enums'

export const PersonalInfo = () => {
  const { currentRole } = useAuth()
  const isCurrentUserGraduate = currentRole === Role.GRADUATE
  const getEmailErrorMessageByType = type => {
    switch (type) {
      case 'pattern':
        return 'Insira um e-mails válido.'
      case 'required':
        return 'Digite o e-mails.'
      default:
        return 'Campo inválido'
    }
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>Informações pessoais</Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ paddingLeft: '15px' }}>
          <Grid container rowSpacing={3}>
            <Grid item xs={5}>
              <FormControl fullWidth>
                <Input label={'Nome'} name={'graduateName'} />
              </FormControl>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <FormControl fullWidth>
                <Input
                  label={'E-mail'}
                  name={'email'}
                  parseError={({ type }) => getEmailErrorMessageByType(type)}
                  required
                />
              </FormControl>
            </Grid>

            {!isCurrentUserGraduate && (
              <Grid item xs={11}>
                <FormControl fullWidth>
                  <Input label={'Casos de Sucesso'} name={'successCase'} rows={4} multiline />
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
