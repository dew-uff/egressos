import { Subtitle } from './index.style'
import React, { useCallback, useState } from 'react'
import {
  DatePicker,
  InputMui,
  SelectMui,
  Grid,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Typography,
  MenuItem,
  InputLabel,
  FormHelperText,
  debounce,
  Divider,
  showErrorToast,
} from '@components'
import { GraduateWorkHistoriesInfo, InstitutionInfoDTO, Option } from './types'
import { Role } from '@utils/enums'
import { SelectItem } from '@utils/types'
import dayjs, { Dayjs } from 'dayjs'
import { useAuth } from '@context/AuthProvider'
import { Controller, useController } from 'react-hook-form'
import { CNPQScholarshipsModal } from '@modules/WorkHistoryEdit/CNPQScholarshipModal'
import { CNPQScholarshipInfo } from '@modules/WorkHistoryEdit/CNPQScholarshipInfo'
import { getInstitutionAutocomplete } from '@modules/WorkHistoryEdit/api'

interface Props {
  cnpqLevels: SelectItem[]
  control: any
  graduateInfo: GraduateWorkHistoriesInfo
  institutionTypes: Option[]
}

export const AcademicInfo = ({ graduateInfo, cnpqLevels, institutionTypes, control }: Props) => {
  const { currentRole } = useAuth()
  const isCurrentUserGraduate = currentRole === Role.GRADUATE

  const [isAddCNPQScholarshipOpen, setIsAddCNPQScholarshipOpen] = useState<boolean>(false)

  const {
    field: { value: institutionIdValue, onChange: institutionIdOnChange },
  } = useController({ control, name: 'postDoctorate.institution.id' })

  const {
    field: { onChange: institutionTypeIdOnChange },
  } = useController({ control, name: 'postDoctorate.institution.typeId' })

  const {
    field: { value: cnpqScholarships, onChange: setCNPQScholarships },
  } = useController({ control, name: 'cnpqScholarships' })

  const {
    field: { value: hasPostDoctorate },
  } = useController({
    control,
    name: 'hasPostDoctorate',
  })

  const [options, setOptions] = useState<InstitutionInfoDTO[]>([])

  const getData = async (searchTerm: string) => {
    try {
      const data = await getInstitutionAutocomplete(searchTerm)
      setOptions(data)
    } catch (error) {
      showErrorToast('Erro ao buscar instituições.')
    }
  }

  const debounceGetData = useCallback(
    debounce(inputValue => getData(inputValue), 1000),
    []
  )
  const onInputChange = (inputValue, onChangeInstitution) => {
    if (inputValue) {
      onChangeInstitution(inputValue)
      debounceGetData(inputValue)
    } else {
      setOptions([])
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12} pb={2}>
            <Divider textAlign="left">
              <Subtitle>Informações acadêmicas</Subtitle>
            </Divider>
          </Grid>
          <Grid item xs={12} pb={3}>
            <CNPQScholarshipInfo
              cnpqLevels={cnpqLevels}
              control={control}
              graduateInfo={graduateInfo}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ paddingLeft: '15px' }}>
              <Grid container rowSpacing={3}>
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
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Controller
                      name="postDoctorate.institution.name"
                      control={control}
                      rules={{ required: hasPostDoctorate === 1 }}
                      render={({
                        field: {
                          onChange: onChangePostDoctorateInstitution,
                          value: valuePostDoctorateInstitution,
                        },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          freeSolo
                          disabled={hasPostDoctorate !== 1}
                          noOptionsText="Nenhuma instituição encontrada"
                          disablePortal
                          onInputChange={(_event, inputValue) =>
                            onInputChange(inputValue, onChangePostDoctorateInstitution)
                          }
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1">{option.name}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="body2" color="gray">
                                    {option?.type?.name}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </li>
                          )}
                          inputValue={valuePostDoctorateInstitution || ''}
                          getOptionLabel={option => option?.name || option}
                          defaultValue={''}
                          options={options}
                          renderInput={params => (
                            <InputMui
                              {...params}
                              label="Nome da instituição"
                              variant="outlined"
                              pa={() => 'Campo obrigatório.'}
                              error={!!error}
                              helperText={error ? 'Campo obrigatório.' : ''}
                            />
                          )}
                          onChange={(_event, value, reason) => {
                            let name = value?.name
                            let typeId = value?.type.id
                            let id = value?.id
                            if (reason === 'clear') {
                              name = null
                              typeId = null
                              id = null
                            }
                            onChangePostDoctorateInstitution(name)
                            institutionTypeIdOnChange(typeId)
                            institutionIdOnChange(id)
                          }}
                          value={valuePostDoctorateInstitution}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor={'labelPostDocType'}>Tipo da Instituição</InputLabel>
                    <Controller
                      control={control}
                      name={'postDoctorate.institution.typeId'}
                      rules={{
                        required: hasPostDoctorate === 1,
                        validate: value => hasPostDoctorate !== 1 || value !== 0,
                      }}
                      render={({ field: { value, ...rest }, fieldState: { error } }) => (
                        <>
                          <SelectMui
                            {...rest}
                            value={value ?? 0}
                            label={'Tipo da Instituição'}
                            labelId={'labelPostDocType'}
                            disabled={hasPostDoctorate !== 1 || !!institutionIdValue}
                            error={!!error}
                          >
                            {institutionTypes.map(type => (
                              <MenuItem key={type.id} value={type.id}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </SelectMui>
                          <FormHelperText variant="standard" sx={{ color: '#d32f2f' }}>
                            {error ? 'Campo obrigatório.' : ''}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Controller
                      name={'postDoctorate.startedAt'}
                      control={control}
                      rules={{
                        required: hasPostDoctorate === 1,
                      }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DatePicker
                          format={'DD/MM/YYYY'}
                          label={'Data de início'}
                          value={typeof value === 'string' ? dayjs(value) : value}
                          disabled={hasPostDoctorate !== 1}
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
                <Grid item xs={1} />
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <Controller
                      name={'postDoctorate.endedAt'}
                      control={control}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <DatePicker
                          format={'DD/MM/YYYY'}
                          label={'Data de término'}
                          value={typeof value === 'string' ? dayjs(value) : value}
                          disabled={hasPostDoctorate !== 1}
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
                {currentRole && currentRole === Role.ADMIN && (
                  <>
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel id="labelHasPostDoctorate">
                          Concluiu o doutorado no PGC/UFF?
                        </FormLabel>
                        <Controller
                          name={'hasFinishedDoctorateOnUFF'}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup
                              row
                              aria-labelledby={'labelHasFinishedDoctorateOnUFF'}
                              name={'hasFinishedDoctorateOnUFF'}
                              value={value}
                              onChange={onChange}
                            >
                              <FormControlLabel value={'true'} control={<Radio />} label={'Sim'} />
                              <FormControlLabel value={'false'} control={<Radio />} label={'Não'} />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel id="labelHasFinishedDoctorateOnUFF">
                          Concluiu o mestrado no PGC ou CAA - UFF ?
                        </FormLabel>
                        <Controller
                          name={'hasFinishedMasterDegreeOnUFF'}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup
                              aria-labelledby={'labelHasFinishedDoctorateOnUFF'}
                              row
                              name={'hasFinishedMasterDegreeOnUFF'}
                              value={value}
                              onChange={onChange}
                            >
                              <FormControlLabel value={'true'} control={<Radio />} label={'Sim'} />
                              <FormControlLabel value={'false'} control={<Radio />} label={'Não'} />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
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
