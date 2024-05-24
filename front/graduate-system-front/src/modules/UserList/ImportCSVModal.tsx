import { Modal } from 'react-bootstrap'
import { DialogTitleTypography } from '@styles/index.style'
import {
  Box,
  Button,
  CloudUploadRoundedIcon,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@components'
import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { importCSV } from '@modules/UserList/api'

interface Props {
  show: boolean
  handleClose: () => void
  onSuccess: () => void
  onFail: (error: string) => void
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const ImportCSVModal = ({ show, handleClose, onSuccess, onFail }: Props) => {
  const [file, setFile] = React.useState<File>()

  const handleOnChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    setFile(event.target.files[0])
  }

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault()
      if (!file) {
        onFail('Nenhum arquivo selecionado')
        return
      }
      await importCSV(file, event.target.isDoctorateGraduates.value === 'true')
      onSuccess()
    } catch (e) {
      onFail(e.response.data)
    }
  }

  const onClose = () => {
    setFile(undefined)
    handleClose()
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Box component={'form'} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <DialogTitleTypography>Importar Planilha</DialogTitleTypography>
        </Modal.Header>
        <Modal.Body>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="isDoctorateGraduatesLabel">Tipo de planilha:</FormLabel>
                <RadioGroup
                  aria-labelledby="isDoctorateGraduatesLabel"
                  defaultValue="false"
                  name="isDoctorateGraduates"
                >
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="Egressos de mestrado"
                  />
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Egressos de doutorado"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadRoundedIcon />}
                >
                  Fazer upload do arquivo CSV
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleOnChangeFile}
                    name={'csvFile'}
                    accept=".csv"
                    multiple={false}
                  />
                </Button>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {file && (
                <Box>
                  <ul>
                    <li>
                      <Typography color="text.primary">{file.name}</Typography>
                    </li>
                    <li>
                      <Typography color="text.secondary">{file.size} bytes</Typography>
                    </li>
                  </ul>
                </Box>
              )}
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button type={'submit'} size={'large'} variant={'contained'} disabled={!file}>
            Importar
          </Button>
        </Modal.Footer>
      </Box>
    </Modal>
  )
}

export default ImportCSVModal
