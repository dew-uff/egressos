import { Modal } from 'react-bootstrap'
import { DialogTitleTypography } from '@styles/index.style'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputMui as TextField,
  SelectMui,
  Checkbox,
} from '@components'
import React from 'react'
import { InputLabel, MenuItem } from '@mui/material'
import { Role, RoleTranslation } from '@utils/enums'

interface Props {
  handleClose: () => void
  isShowing: boolean
  currentEmail: any
  previousEmail: any
  handleUpdate: (email: any) => void
  handleSave: (email: any) => void
  setCurrentEmail: (email: any) => void
}

const EditModal = ({
  handleClose,
  isShowing,
  currentEmail,
  previousEmail,
  handleUpdate,
  handleSave,
  setCurrentEmail,
}: Props) => {
  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })

  return (
    <Modal show={isShowing} onHide={handleClose}>
      <Modal.Header closeButton>
        <DialogTitleTypography>
          {currentEmail.id ? 'Editar' : 'Adicionar'} E-mail
        </DialogTitleTypography>
      </Modal.Header>
      <Modal.Body>
        <Grid container rowSpacing={4}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.name}
                disabled={!!currentEmail.id}
                required
                name={'name'}
                label={'Nome do e-mail'}
                onChange={({ target }) => setCurrentEmail({ ...currentEmail, name: target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.title}
                required
                name={'title'}
                label={'Assunto'}
                onChange={({ target }) => setCurrentEmail({ ...currentEmail, title: target.value })}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.content}
                required
                name={'content'}
                label={'Conteúdo'}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, content: target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.buttonText}
                required
                name={'buttonText'}
                label={'Texto do Botão'}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, buttonText: target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                value={currentEmail.buttonURL}
                required
                name={'buttonURL'}
                label={'URL do botão'}
                onChange={({ target }) =>
                  setCurrentEmail({ ...currentEmail, buttonURL: target.value })
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel variant="outlined" id="userRoleLabel">
                Papel dos usuários que vão receber o e-mail*
              </InputLabel>
              <SelectMui
                labelId={'userRoleLabel'}
                id={'userRole'}
                name={'userRole'}
                disabled={!!currentEmail.id}
                label={'Papel dos usuários que vão receber o e-mail*'}
                value={currentEmail.userRole || ''}
                onChange={event => {
                  if (event.target.value)
                    setCurrentEmail(email => ({
                      ...email,
                      userRole: event.target.value,
                    }))
                }}
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>
                    {RoleTranslation[role]}
                  </MenuItem>
                ))}
              </SelectMui>
            </FormControl>
          </Grid>
          {currentEmail.userRole === Role.ADMIN && (
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={'active'}
                      disabled={previousEmail.active}
                      checked={currentEmail.active}
                      onChange={() =>
                        setCurrentEmail(email => ({
                          ...email,
                          active: !currentEmail.active,
                        }))
                      }
                    />
                  }
                  label="Enviar automaticamente para administradores que aceitaram receber e-mails de atualização de histórico do egresso"
                />
              </FormGroup>
            </Grid>
          )}
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size={'large'}
          variant={'contained'}
          onClick={() => (currentEmail.id ? handleUpdate(currentEmail) : handleSave(currentEmail))}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditModal
