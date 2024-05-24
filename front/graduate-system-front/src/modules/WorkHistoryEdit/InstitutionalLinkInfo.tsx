import { Subtitle } from './index.style'
import {
  AddRounded,
  SelectMui,
  Paper,
  Checkbox,
  DeleteForeverRoundedIcon,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  CustomTable,
  ActionIcon,
  Button,
  Box,
  InputLabel,
  MenuItem,
  Divider,
  EditRoundedIcon,
  Tooltip,
} from '@components'
import React, { useEffect, useState } from 'react'
import { ErrorMessage, Fields, Label } from '@styles/index.style'
import { WorkHistoryInfo } from '@modules/WorkHistoryEdit/types'
import { SelectItem } from '@utils/types'
import dayjs from 'dayjs'
import { Control, Controller, useController } from 'react-hook-form'
import {
  InstitutionalLinkInfoType,
  InstitutionalLinkModal,
} from '@modules/WorkHistoryEdit/InstitutionalLinkModal'
import { Role } from '@utils/enums'
import { useAuth } from '@context/AuthProvider'
import { HISTORY_STATUS } from '@modules/Egressos/types'

interface Props {
  institutionTypes: SelectItem[]
  control: Control<any>
}

const rowsByStatus = (
  items: (WorkHistoryInfo | InstitutionalLinkInfoType)[],
  institutionTypes: SelectItem[],
  handleEdit: (item: InstitutionalLinkInfoType | WorkHistoryInfo, index: number) => void,
  handleDelete: (index: number) => void
) => {
  return items.map((item: InstitutionalLinkInfoType | WorkHistoryInfo, index: number) => {
    const getStatus = () => {
      if ('modified' in item && item.modified) return HISTORY_STATUS.UPDATED_PARTIALLY
      if (item.id) return 'default'
      return HISTORY_STATUS.UPDATED
    }
    const status = getStatus()

    return [
      { body: <Fields status={status}>{item.institution?.name ?? '-'}</Fields> },
      {
        body: (
          <Fields status={status}>
            {institutionTypes.find(type => type.id === item.institution?.typeId)?.label ?? '-'}
          </Fields>
        ),
      },
      { body: <Fields status={status}>{item.position ?? '-'}</Fields> },
      {
        body: (
          <Fields status={status}>
            {!item.startedAt || item.startedAt === 'null'
              ? '-'
              : dayjs(item.startedAt).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <Fields status={status}>
            {!item.endedAt || item.endedAt === 'null'
              ? '-'
              : dayjs(item.endedAt).format('DD/MM/YYYY')}
          </Fields>
        ),
      },
      {
        body: (
          <section>
            <ActionIcon onClick={() => handleEdit(item, index)}>
              <EditRoundedIcon />
            </ActionIcon>
            <Tooltip title="Só é possível excluir vínculos não salvos.">
              <span>
                <ActionIcon disabled={!!item.id} onClick={() => handleDelete(index)}>
                  <DeleteForeverRoundedIcon />
                </ActionIcon>
              </span>
            </Tooltip>
          </section>
        ),
        width: '10%',
      },
    ]
  })
}

export const InstitutionalLinkInfo = ({ institutionTypes, control }: Props) => {
  const { currentRole } = useAuth()
  const isCurrentUserGraduate = currentRole === Role.GRADUATE

  const [isAddWorkHistoryOpen, setIsAddWorkHistoryOpen] = useState<boolean>(false)
  const [currentInstitutionalLink, setCurrentInstitutionalLink] =
    useState<InstitutionalLinkInfoType>()

  const [currentInstitutionalLinksSelected, setCurrentInstitutionalLinksSelected] = useState<
    number[]
  >([])

  const {
    field: { onChange: setInstitutionalLinks, value: institutionalLinks },
  } = useController({ control, name: 'institutionalLinks' })

  const {
    field: { onChange: setCurrentWorkHistories, value: currentWorkHistories },
  } = useController({ control, name: 'workHistories' })

  const {
    field: { onChange: setCurrentInstitutionalLinks },
  } = useController({ control, name: 'currentInstitutionalLinks' })

  const currentInstitutionalLinksOptions = [...currentWorkHistories, ...institutionalLinks].filter(
    link => !link.endedAt || link.endedAt === 'null'
  )

  const {
    field: { value: hasCurrentWorkHistory },
    fieldState: { error },
  } = useController({
    control,
    name: 'hasCurrentWorkHistory',
    rules: {
      validate: value => {
        if (value === 1)
          return (
            currentInstitutionalLinksSelected?.length === currentInstitutionalLinksOptions?.length
          )
        if (value === 0) return currentInstitutionalLinksOptions?.length === 0
        return true
      },
    },
  })

  const handleOpenEditInstitutionalLink = (
    current: InstitutionalLinkInfoType | WorkHistoryInfo,
    index: number
  ) => {
    setCurrentInstitutionalLink({
      ...current,
      startedAt: dayjs(current.startedAt),
      endedAt: current.endedAt && current.endedAt !== 'null' ? dayjs(current.endedAt) : null,
      index,
    })
    setIsAddWorkHistoryOpen(true)
  }

  const handleDeleteInstitutionalLink = (index: number) => {
    setCurrentInstitutionalLinks([])
    setCurrentInstitutionalLinksSelected([])
    setInstitutionalLinks(institutionalLinks.filter((_item: never, i: number) => i !== index))
  }

  const rows = [
    ...rowsByStatus(
      [...institutionalLinks, ...currentWorkHistories],
      institutionTypes,
      handleOpenEditInstitutionalLink,
      handleDeleteInstitutionalLink
    ),
  ]

  const columns = [
    {
      name: 'Nome da instituição',
    },
    {
      name: 'Tipo da instituição',
    },
    {
      name: 'Cargo',
    },
    {
      name: 'Data de Início',
    },
    {
      name: 'Data de Término',
    },
    { name: 'Ações', width: '10%' },
  ]

  const getSelectText = institutionItem => {
    return `${institutionItem.institution.name} -${
      institutionItem.position ? ` ${institutionItem.position} -` : ''
    } ${(typeof institutionItem.startedAt === 'string'
      ? dayjs(institutionItem.startedAt)
      : institutionItem.startedAt
    ).format('DD/MM/YYYY')}`
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Subtitle>
            Informações sobre vínculos institucionais
            <Button
              sx={{ marginLeft: '20px' }}
              size={'large'}
              variant="contained"
              onClick={() => setIsAddWorkHistoryOpen(true)}
            >
              Adicionar
              <AddRounded />
            </Button>
          </Subtitle>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ paddingLeft: '15px' }}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              {rows?.length ? (
                <CustomTable columns={columns} rows={rows} />
              ) : (
                <Paper variant="outlined" sx={{ borderRadius: '8px', borderStyle: 'dashed' }}>
                  <Box sx={{ padding: 2 }}>
                    <Label>Não há histórico de vínculos institucionais.</Label>
                  </Box>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="labelHasWorkHistory">
                  Possui vínculo institucional atualmente?
                </FormLabel>
                <Controller
                  name={'hasCurrentWorkHistory'}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      row
                      aria-labelledby={'labelHasWorkHistory'}
                      name={'hasCurrentWorkHistory'}
                      value={value}
                      onChange={event => {
                        const value = parseInt(event.target.value)
                        onChange(value)
                        if (value !== 1) {
                          setCurrentInstitutionalLinks([])
                          setCurrentInstitutionalLinksSelected([])
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

            {hasCurrentWorkHistory === 1 &&
              (currentInstitutionalLinksOptions?.length ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="currentInstitutionsLabel">Vínculos atuais</InputLabel>
                    <SelectMui
                      labelId={'currentInstitutionsLabel'}
                      id={'currentInstitutions'}
                      name={'currentInstitutions'}
                      label={'Vínculos atuais'}
                      value={currentInstitutionalLinksSelected}
                      renderValue={(selected: never[]) => {
                        return selected
                          ?.map(item => getSelectText(currentInstitutionalLinksOptions[item]))
                          .join(', ')
                      }}
                      multiple
                      onChange={({ target: { value } }) => {
                        const institutionalLinksUpdated = (value as number[]).map(
                          item => currentInstitutionalLinksOptions[item]
                        )
                        setCurrentInstitutionalLinks(institutionalLinksUpdated)

                        setCurrentInstitutionalLinksSelected(
                          (typeof value === 'string' ? value.split(',') : value) as never
                        )
                      }}
                    >
                      {currentInstitutionalLinksOptions.map((institutionItem, index) => (
                        <MenuItem key={index} value={index}>
                          <Checkbox
                            checked={currentInstitutionalLinksSelected.indexOf(index) > -1}
                          />
                          {getSelectText(institutionItem)}
                        </MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Label color={'#cb0000'}>
                    Adicione um vínculo institucional sem data de término e selecione.
                  </Label>
                </Grid>
              ))}
            {error && (
              <ErrorMessage>
                Selecione os vínculos institucionais atuais e/ou adicione uma data de término nos
                não selecionados.
              </ErrorMessage>
            )}
            <InstitutionalLinkModal
              currentInstitutionalLink={currentInstitutionalLink}
              setCurrentInstitutionalLink={setCurrentInstitutionalLink}
              workHistories={currentWorkHistories}
              setWorkHistories={setCurrentWorkHistories}
              institutionalLinks={institutionalLinks}
              setInstitutionalLinks={setInstitutionalLinks}
              institutionTypes={institutionTypes}
              isAddWorkHistoryOpen={isAddWorkHistoryOpen}
              setIsAddWorkHistoryOpen={setIsAddWorkHistoryOpen}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
