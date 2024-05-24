import React, { useState } from 'react'
import {
  ActionIcon,
  Button,
  Paper,
  SelectMui,
  Grid,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Checkbox,
  CustomTable,
  InputLabel,
  DeleteForeverRoundedIcon,
  AddRounded,
} from '@components'
import { GraduateWorkHistoriesInfo } from './types'
import { Role } from '@utils/enums'
import { SelectItem } from '@utils/types'
import { Fields, Label } from '@styles/index.style'
import dayjs from 'dayjs'
import { useAuth } from '@context/AuthProvider'
import { Controller, useController } from 'react-hook-form'
import { CNPQScholarshipsModal } from '@modules/WorkHistoryEdit/CNPQScholarshipModal'
import { Typography } from '@mui/material'

interface Props {
  cnpqLevels: SelectItem[]
  control: any
  graduateInfo: GraduateWorkHistoriesInfo
}

export const CNPQScholarshipInfo = ({ graduateInfo, cnpqLevels, control }: Props) => {
  const { currentRole } = useAuth()
  const isCurrentUserGraduate = currentRole === Role.GRADUATE

  const { cnpqScholarships: historyCNPQScholarships } = graduateInfo

  const [isAddCNPQScholarshipOpen, setIsAddCNPQScholarshipOpen] = useState<boolean>(false)
  const [currentCNPQScholarshipsSelected, setCurrentCNPQScholarshipsSelected] = useState<number[]>(
    []
  )

  const {
    field: { value: cnpqScholarships, onChange: setCNPQScholarships },
  } = useController({ control, name: 'cnpqScholarships' })

  const currentScholarshipsOptions = [...cnpqScholarships, ...historyCNPQScholarships].filter(
    scholarship => !scholarship.endedAt || scholarship.endedAt === 'null'
  )

  const {
    field: { onChange: setCurrentCNPQScholarships },
  } = useController({ control, name: 'currentCNPQScholarships' })

  const {
    field: { value: hasCurrentCNPQScholarship },
  } = useController({
    control,
    name: 'hasCurrentCNPQScholarship',
    rules: {
      validate: value => {
        if (value === 1)
          return currentCNPQScholarshipsSelected?.length === currentScholarshipsOptions?.length
        if (value === 0) return currentScholarshipsOptions?.length === 0
        return true
      },
    },
  })

  const getSelectText = scholarship => {
    return `${
      cnpqLevels.find(type => type.id === scholarship.levelId)?.label
    } - ${(typeof scholarship.startedAt === 'string'
      ? dayjs(scholarship.startedAt)
      : scholarship.startedAt
    ).format('DD/MM/YYYY')}`
  }

  const rows = [
    ...cnpqScholarships.map((scholarship, index) => [
      {
        body: (
          <Fields status={'UPDATED'}>
            {cnpqLevels.find(type => type.id === scholarship.levelId)?.label}
          </Fields>
        ),
      },
      {
        body: (
          <Fields status={'UPDATED'}>{dayjs(scholarship.startedAt).format('DD/MM/YYYY')}</Fields>
        ),
      },
      {
        body: (
          <Fields status={'UPDATED'}>
            {!scholarship.endedAt ? '-' : dayjs(scholarship.endedAt).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <ActionIcon
            onClick={() => {
              setCurrentCNPQScholarshipsSelected([])
              setCurrentCNPQScholarships([])
              setCNPQScholarships(cnpqScholarships.filter((_, i) => i !== index))
            }}
          >
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]),
    ...historyCNPQScholarships.map(scholarship => [
      { body: cnpqLevels.find(type => type.id === scholarship.levelId)?.label },
      {
        body: dayjs(scholarship.startedAt).format('DD/MM/YYYY'),
      },
      {
        body:
          !scholarship.endedAt || scholarship.endedAt === 'null'
            ? '-'
            : dayjs(scholarship.endedAt).format('DD/MM/YYYY'),
      },
    ]),
  ]

  const columns = [
    {
      name: 'Nome da bolsa',
    },
    {
      name: 'Data de Início',
    },
    {
      name: 'Data de Término',
    },
    { name: 'Ações', width: '10%' },
  ]

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item xs={12}>
        <Typography color="primary.main" variant="h6" fontWeight="light">
          Bolsa de Produtividade CNPq
          <Button
            sx={{ marginLeft: '20px' }}
            size={'large'}
            variant="contained"
            // disabled={hasInstitutionalLink === -1 || hasInstitutionalLink === 0}
            onClick={() => setIsAddCNPQScholarshipOpen(true)}
          >
            Adicionar
            <AddRounded />
          </Button>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ paddingLeft: '15px' }}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              {rows?.length ? (
                <CustomTable columns={columns} rows={rows} />
              ) : (
                <Paper variant="outlined" sx={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                  <Box sx={{ padding: 2 }}>
                    <Label>Não há histórico de bolsas.</Label>
                  </Box>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="labelHasCNPQScholarship">
                  Possui Bolsa de Produtividade CNPq atualmente?
                </FormLabel>
                <Controller
                  name={'hasCurrentCNPQScholarship'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      row
                      aria-labelledby={'labelHasCNPQScholarship'}
                      name={'hasCurrentCNPQScholarship'}
                      value={value}
                      onChange={event => {
                        const value = parseInt(event.target.value)
                        onChange(value)
                        if (value !== 1) {
                          setCurrentCNPQScholarships([])
                          setCurrentCNPQScholarshipsSelected([])
                        }
                      }}
                    >
                      <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                      <FormControlLabel value={0} control={<Radio />} label={'Não'} />
                      <FormControlLabel
                        hidden={isCurrentUserGraduate}
                        value={-1}
                        control={<Radio />}
                        label={'Não sei'}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
            {hasCurrentCNPQScholarship === 1 &&
              (currentScholarshipsOptions?.length ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="currentScholarshipsLabel">Bolsas atuais</InputLabel>
                    <SelectMui
                      labelId={'currentScholarshipsLabel'}
                      id={'currentScholarships'}
                      name={'currentScholarships'}
                      label={'Bolsas atuais'}
                      value={currentCNPQScholarshipsSelected}
                      renderValue={(selected: never[]) =>
                        selected
                          ?.map(item => getSelectText(currentScholarshipsOptions[item]))
                          .join(', ')
                      }
                      multiple
                      onChange={({ target: { value } }) => {
                        const cnpqScholarshipUpdated = (value as number[]).map(
                          item => currentScholarshipsOptions[item]
                        )
                        setCurrentCNPQScholarships(cnpqScholarshipUpdated)
                        setCurrentCNPQScholarshipsSelected(
                          (typeof value === 'string' ? value.split(',') : value) as never
                        )
                      }}
                    >
                      {currentScholarshipsOptions.map((institutionItem, index) => (
                        <MenuItem key={index} value={index}>
                          <Checkbox checked={currentCNPQScholarshipsSelected.indexOf(index) > -1} />
                          {getSelectText(institutionItem)}
                        </MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Label color={'#cb0000'}>
                    Adicione um registro de bolsa sem data de término.
                  </Label>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Grid>
      <CNPQScholarshipsModal
        cnpqScholarships={cnpqScholarships}
        setCNPQScholarships={setCNPQScholarships}
        cnpqLevels={cnpqLevels}
        isAddCNPQScholarshipOpen={isAddCNPQScholarshipOpen}
        setIsAddCNPQScholarshipOpen={setIsAddCNPQScholarshipOpen}
      />
    </Grid>
  )
}
