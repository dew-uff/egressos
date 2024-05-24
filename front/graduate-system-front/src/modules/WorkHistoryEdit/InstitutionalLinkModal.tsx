import { FormControl, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  DatePicker,
  debounce,
  InputMui,
  SelectMui,
  showErrorToast,
  Typography,
} from '@components'
import { SelectItem } from '@utils/types'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { Dayjs } from 'dayjs'
import { useAuth } from '@context/AuthProvider'
import { Role } from '@utils/enums'
import { getInstitutionAutocomplete } from '@modules/WorkHistoryEdit/api'
import { InstitutionInfoDTO, WorkHistoryInfo } from '@modules/WorkHistoryEdit/types'

interface Props {
  currentInstitutionalLink?: InstitutionalLinkInfoType
  setCurrentInstitutionalLink: (value: InstitutionalLinkInfoType) => void
  workHistories: WorkHistoryInfo[]
  setWorkHistories: (value: WorkHistoryInfo[]) => void
  institutionalLinks: InstitutionalLinkInfoType[]
  setInstitutionalLinks: (value: InstitutionalLinkInfoType[]) => void
  institutionTypes: SelectItem[]
  isAddWorkHistoryOpen: boolean
  setIsAddWorkHistoryOpen: (value: boolean) => void
}

export interface InstitutionalLinkInfoType {
  id?: string | null
  index?: number
  position?: string | null
  institution?: {
    id?: string | null
    typeId?: string | null
    name?: string | null
  }
  startedAt?: Dayjs | null
  endedAt?: Dayjs | null
}

export const InstitutionalLinkModal = ({
  workHistories,
  setWorkHistories,
  currentInstitutionalLink,
  setCurrentInstitutionalLink,
  institutionalLinks,
  institutionTypes,
  setInstitutionalLinks,
  isAddWorkHistoryOpen,
  setIsAddWorkHistoryOpen,
}: Props) => {
  const { currentRole } = useAuth()

  const isCurrentUserGraduate = currentRole === Role.GRADUATE

  const institutionalLinkDefaultState: InstitutionalLinkInfoType = {
    id: null,
    position: null,
    institution: {
      id: null,
      typeId: null,
      name: null,
    },
    startedAt: null,
    endedAt: null,
  }

  const [institutionalLink, setInstitutionalLink] = useState<InstitutionalLinkInfoType>(
    currentInstitutionalLink ?? institutionalLinkDefaultState
  )

  useEffect(() => {
    setInstitutionalLink(currentInstitutionalLink ?? institutionalLinkDefaultState)
  }, [currentInstitutionalLink])

  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionInfoDTO | null>(null)

  const { institution } = institutionalLink ?? {}
  const { name: institutionName, id: institutionId, typeId: institutionTypeId } = institution ?? {}

  const [options, setOptions] = useState<InstitutionInfoDTO[]>([])

  const onModalClose = () => {
    setSelectedInstitution(null)
    setCurrentInstitutionalLink(institutionalLinkDefaultState)
    setIsAddWorkHistoryOpen(false)
    setInstitutionalLink(institutionalLinkDefaultState)
  }

  const handleSave = () => {
    if (institutionalLink && institutionalLink.index !== undefined) {
      if (institutionalLink.index < institutionalLinks.length) {
        setInstitutionalLinks(
          institutionalLinks.map((link, index) => {
            if (index === institutionalLink.index) {
              return institutionalLink
            }
            return link
          })
        )
        return
      }
      const indexHistory = institutionalLink.index - institutionalLinks.length
      setWorkHistories(
        workHistories.map((history, index) => {
          if (index === indexHistory) {
            return {
              ...history,
              institution: {
                id: institutionalLink.institution?.id ?? undefined,
                name: institutionalLink.institution?.name ?? undefined,
                typeId: institutionalLink.institution?.typeId ?? undefined,
              },
              position: institutionalLink.position ?? undefined,
              startedAt: institutionalLink.startedAt?.toISOString(),
              endedAt: institutionalLink.endedAt
                ? institutionalLink.endedAt.toISOString()
                : undefined,
              modified: true,
            }
          }
          return history
        })
      )
    } else {
      setInstitutionalLinks([...institutionalLinks, institutionalLink])
    }
    onModalClose()
  }

  const checkIfInstitutionalLinkInfoIsValid = !!(
    institutionalLink.institution?.typeId &&
    institutionalLink.institution?.name &&
    institutionalLink.startedAt &&
    (isCurrentUserGraduate ? institutionalLink.position : true)
  )

  const getData = async (searchTerm: string) => {
    try {
      const data = await getInstitutionAutocomplete(searchTerm)
      setOptions(data)
    } catch (error) {
      showErrorToast('Erro ao buscar instituições.')
    }
  }

  const setInstitutionName = (institutionName?: string) => {
    setInstitutionalLink(oldInstitutionalLink => {
      const oldInstitution = oldInstitutionalLink.institution

      return {
        ...institutionalLink,
        institution: {
          ...oldInstitution,
          name: institutionName,
        },
      }
    })
  }

  const debounceGetData = useCallback(
    debounce(inputValue => getData(inputValue), 1000),
    []
  )

  const onInputChange = async (_: any, institutionName?: string) => {
    if (institutionName) {
      setInstitutionName(institutionName)
      await debounceGetData(institutionName)
    } else {
      setOptions([])
    }
  }

  useEffect(() => {
    setInstitutionalLink(currentInstitutionalLink ?? institutionalLinkDefaultState)
  }, [currentInstitutionalLink])

  return (
    <Modal show={isAddWorkHistoryOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Fields>{institutionalLink.id ? 'Editar' : 'Adicionar'} Vínculo Institucional</Fields>
      </Modal.Header>
      <Modal.Body>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                freeSolo
                noOptionsText="Nenhuma instituição encontrada"
                disablePortal
                onInputChange={onInputChange}
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
                inputValue={institutionName ?? ''}
                options={options}
                renderInput={params => (
                  <InputMui
                    {...params}
                    label="Nome da instituição"
                    variant="outlined"
                    pa={() => 'Campo obrigatório.'}
                  />
                )}
                value={selectedInstitution}
                getOptionLabel={option => (typeof option === 'string' ? option : option?.name)}
                onChange={(_event, value, reason) => {
                  const newValue = value as unknown as InstitutionInfoDTO
                  const getInstitutionFieldsValueByReason = () => {
                    if (reason === 'clear') {
                      return institutionalLinkDefaultState.institution
                    }

                    const {
                      id,
                      name,
                      type: { id: typeId },
                    } = newValue
                    return {
                      id,
                      name,
                      typeId,
                    }
                  }

                  setSelectedInstitution(newValue)
                  setInstitutionalLink(oldLink => ({
                    ...oldLink,
                    institution: getInstitutionFieldsValueByReason(),
                  }))
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="institutionType">Tipo de Instituição*</InputLabel>
              <SelectMui
                labelId={'institutionTypeLabel'}
                id={'institutionType'}
                name={'institutionType'}
                label={'Tipo de Instituição*'}
                disabled={institutionId}
                value={institutionTypeId || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value) {
                    const institution = institutionalLink.institution
                    setInstitutionalLink({
                      ...institutionalLink,
                      institution: {
                        ...institution,
                        typeId: event.target.value as string,
                      },
                    })
                  }
                }}
              >
                {institutionTypes.map(institutionItem => (
                  <MenuItem key={institutionItem.id} value={institutionItem.id}>
                    {institutionItem.label}
                  </MenuItem>
                ))}
              </SelectMui>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputMui
                value={institutionalLink.position}
                onChange={event =>
                  setInstitutionalLink({
                    ...institutionalLink,
                    position: event.target.value,
                  })
                }
                name={'position'}
                label={`Cargo${isCurrentUserGraduate ? '*' : ''}`}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de início*'}
                value={institutionalLink.startedAt}
                disableFuture
                onChange={(startedAt: Dayjs) => {
                  setInstitutionalLink({
                    ...institutionalLink,
                    startedAt,
                  })
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de término'}
                value={institutionalLink.endedAt}
                disableFuture
                onChange={(endedAt: Dayjs) => {
                  setInstitutionalLink({
                    ...institutionalLink,
                    endedAt,
                  })
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Tooltip
          title={'Preencha os campos obrigatórios'}
          disableHoverListener={checkIfInstitutionalLinkInfoIsValid}
        >
          <span>
            <Button
              size={'large'}
              variant={'contained'}
              disabled={!checkIfInstitutionalLinkInfoIsValid}
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
