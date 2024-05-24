import { Modal } from 'react-bootstrap'
import { DialogTitleTypography } from '@styles/index.style'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Button } from '@components'
import React from 'react'
import { Role, RoleTranslation } from '@utils/enums'
import { createUpdateUser } from '@modules/UserList/api'
import { getAPIClient } from '@services/axios'

interface Props {
  show: boolean
  handleClose: () => void
  currentUser: any
  onSuccess: () => void
  onFail: () => void
}

const UserModal = ({ show, handleClose, currentUser, onSuccess, onFail }: Props) => {
  const { id } = currentUser
  const apiClient = getAPIClient()
  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })

  const handleSubmit = async event => {
    event.preventDefault()
    const { name, email, roles } = event.target
    const user = {
      id,
      name: name.value,
      email: email.value,
      roles: typeof roles.value === 'string' ? roles.value.split(',') : roles.value,
    }

    try {
      await createUpdateUser(apiClient, user)
      onSuccess()
    } catch (e) {
      onFail()
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Box component={'form'} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <DialogTitleTypography>{id ? 'Editar' : 'Adicionar'} Usuário</DialogTitleTypography>
        </Modal.Header>
        <Modal.Body>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField defaultValue={currentUser.name} required name={'name'} label={'Nome'} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  defaultValue={currentUser.email}
                  required
                  name={'email'}
                  label={'E-mail'}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor={'roles'}>Papel do Usuário</InputLabel>
                <Select
                  multiple
                  defaultValue={currentUser.roles ?? []}
                  name={'roles'}
                  id={'roles'}
                  label={'Papel do Usuário'}
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>
                      {RoleTranslation[role]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button type={'submit'} size={'large'} variant={'contained'}>
            Salvar
          </Button>
        </Modal.Footer>
      </Box>
    </Modal>
  )
}

export default UserModal
