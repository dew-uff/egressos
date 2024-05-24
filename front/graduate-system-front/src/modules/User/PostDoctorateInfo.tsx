import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material'
import React from 'react'
import { DatePicker, Input } from '@components'
import { Controller, useController } from 'react-hook-form'
import { SelectItem } from '@utils/types'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  control: any
  institutionTypes: SelectItem[]
}
const GraduateInfo = ({ control, institutionTypes }: Props) => {
  const {
    field: { value: hasPostDoctorate },
  } = useController({
    control,
    name: 'hasPostDoctorate',
  })

  return (
    <Grid container rowSpacing={4} columnSpacing={4}>
      <Grid item xs={12}>
        <FormControl>
          <FormLabel id="labelHasPostDoctorate">Possui pós-doutorado?</FormLabel>
          <Controller
            name={'hasPostDoctorate'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                row
                aria-labelledby={'labelHasPostDoctorate'}
                name={'hasPostDoctorate'}
                value={value}
                onChange={({ target }) => {
                  const value = parseInt(target.value)
                  onChange(value)
                }}
              >
                <FormControlLabel value={1} control={<Radio />} label={'Sim'} />
                <FormControlLabel value={0} control={<Radio />} label={'Não'} />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Input
            disabled={!hasPostDoctorate}
            name={'graduate.postDoctorateName'}
            label={'Nome da instituição que foi realizada a pós-graduação'}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor={'graduate.institutionType'}>
            Tipo da instituição da pós-graduação
          </InputLabel>
          <Controller
            control={control}
            name={'graduate.institutionType'}
            render={({ field: { value, ...rest } }) => (
              <Select
                disabled={!hasPostDoctorate}
                {...rest}
                value={value ?? '0'}
                label={'Tipo da instituição da pós-graduação'}
              >
                {institutionTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Controller
            name={'graduate.postDoctorate.startedAt'}
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                disabled={!hasPostDoctorate}
                format={'DD/MM/YYYY'}
                label={'Data de início'}
                value={typeof value === 'string' ? dayjs(value) : value}
                disableFuture
                onChange={(startedAt: Dayjs) => {
                  onChange(startedAt)
                }}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    error: !!error,
                    helperText: error ? 'Campo obrigatório.' : '',
                  },
                }}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Controller
            name={'graduate.postDoctorate.endedAt'}
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de término'}
                value={typeof value === 'string' ? dayjs(value) : value}
                disabled={!hasPostDoctorate}
                disableFuture
                onChange={(endedAt: Dayjs) => {
                  onChange(endedAt)
                }}
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    error: !!error,
                    helperText: error ? 'Campo obrigatório.' : '',
                  },
                }}
              />
            )}
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default GraduateInfo
