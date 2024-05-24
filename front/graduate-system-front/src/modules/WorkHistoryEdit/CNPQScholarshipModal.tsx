import { FormControl, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { Button, DatePicker, SelectMui } from '@components'
import { SelectItem } from '@utils/types'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { Dayjs } from 'dayjs'

interface Props {
  cnpqScholarships: CNPQScholarshipInfoType[]
  setCNPQScholarships: any
  cnpqLevels: SelectItem[]
  isAddCNPQScholarshipOpen: boolean
  setIsAddCNPQScholarshipOpen: (value: boolean) => void
}

interface CNPQScholarshipInfoType {
  id?: string | null
  levelId?: string | null
  startedAt?: Dayjs | null
  endedAt?: Dayjs | null
}

export const CNPQScholarshipsModal = ({
  cnpqScholarships,
  setCNPQScholarships,
  cnpqLevels,
  isAddCNPQScholarshipOpen,
  setIsAddCNPQScholarshipOpen,
}: Props) => {
  const cnpqScholarshipDefaultState: CNPQScholarshipInfoType = {
    id: null,
    levelId: null,
    startedAt: null,
    endedAt: null,
  }
  const [cnpqScholarship, setCNPQScholarship] = useState<CNPQScholarshipInfoType>({
    ...cnpqScholarshipDefaultState,
  })

  const onModalClose = () => {
    setIsAddCNPQScholarshipOpen(false)
    setCNPQScholarship({ ...cnpqScholarshipDefaultState })
  }

  const handleSave = () => {
    setCNPQScholarships([...cnpqScholarships, cnpqScholarship])
    onModalClose()
  }

  const checkIfCNPQScholarshipIsValid = !!(cnpqScholarship.levelId && cnpqScholarship.startedAt)

  return (
    <Modal show={isAddCNPQScholarshipOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Fields>{cnpqScholarship.id ? 'Editar' : 'Adicionar'} Bolsa de Produtividade CNPQ</Fields>
      </Modal.Header>
      <Modal.Body>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="labelCNPQLevel">Nível da Bolsa*</InputLabel>
              <SelectMui
                labelId={'labelCNPQLevel'}
                id={'cnpqLevel'}
                name={'cnpqLevel'}
                label={'Nível da Bolsa*'}
                value={cnpqScholarship.levelId || ''}
                onChange={event => {
                  if (event.target.value)
                    setCNPQScholarship(scholarship => ({
                      ...scholarship,
                      levelId: event.target.value as string,
                    }))
                }}
              >
                {cnpqLevels.map(level => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.label}
                  </MenuItem>
                ))}
              </SelectMui>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de início*'}
                value={cnpqScholarship.startedAt}
                disableFuture
                onChange={(startedAt: Dayjs) => {
                  setCNPQScholarship(scholarship => ({
                    ...scholarship,
                    startedAt,
                  }))
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de término'}
                value={cnpqScholarship.endedAt}
                disableFuture
                onChange={(endedAt: Dayjs) => {
                  setCNPQScholarship(scholarship => ({
                    ...scholarship,
                    endedAt,
                  }))
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Tooltip
          title={'Preencha os campos obrigatórios'}
          disableHoverListener={checkIfCNPQScholarshipIsValid}
        >
          <span>
            <Button
              size={'large'}
              variant={'contained'}
              disabled={!checkIfCNPQScholarshipIsValid}
              onClick={() => handleSave()}
            >
              Salvar
            </Button>
          </span>
        </Tooltip>
      </Modal.Footer>
    </Modal>
  )
}
