import { Grid, Typography } from '@mui/material'
import React from 'react'
import { Button } from '@components'
import { Modal } from 'react-bootstrap'
import { ModalTextField } from '@components/DeleteModal/index.styles'
import { DeleteItem } from './types'

interface Props {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  handleDelete: (id: string | undefined) => Promise<void>
  id: string | undefined
  value: string | undefined
}
const DeleteModal = ({ isOpen, setIsOpen, handleDelete, id, value }: Props) => {
  const onModalClose = () => setIsOpen(false)

  const handleConfirm = async () => {
    await handleDelete(id)
    onModalClose()
  }

  return (
    <Modal show={isOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <ModalTextField>Excluir item</ModalTextField>
      </Modal.Header>
      <Modal.Body>
        <Grid container flexDirection={'column'} display={'flex'} alignItems={'center'} spacing={3}>
          <Grid item xs={12}>
            <Typography color="primary.main">
              Você tem certeza que deseja remover o seguinte item?
            </Typography>
            <Typography color="secondary.dark" sx={{ textAlign: 'center' }}>
              {value}
            </Typography>
          </Grid>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Grid container display={'flex'} justifyContent={'center'} columnSpacing={2}>
          <Grid item>
            <Button size={'large'} variant={'contained'} onClick={handleConfirm}>
              Sim
            </Button>
          </Grid>
          <Grid item>
            <Button size={'large'} variant={'outlined'} onClick={onModalClose}>
              Não
            </Button>
          </Grid>
        </Grid>
      </Modal.Footer>
    </Modal>
  )
}

export { DeleteModal }
export type { DeleteItem }
