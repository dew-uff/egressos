import { FormControl, Grid, InputLabel, MenuItem, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { Autocomplete, Button, DatePicker, InputMui, SelectMui, showErrorToast } from '@components'
import { SelectItem } from '@utils/types'
import { Fields } from '@styles/index.style'
import { Modal } from 'react-bootstrap'
import { UserLean } from '@modules/WorkHistoryEdit/types'
import { getAdvisors, getGraduates } from '@modules/User/api'

interface CIProgram {
  id?: string
  initials?: string
}

interface CourseInfoType {
  id?: string
  program?: CIProgram
  graduate?: UserLean
  defenseMinute?: string
  titleDate?: Date
  advisor?: UserLean
}

interface Props {
  isGraduate?: boolean
  courses?: CourseInfoType[]
  setCourses: (courses: CourseInfoType[]) => void
  programs: SelectItem[]
  isAddCourseOpen: boolean
  setIsAddCourseOpen: (value: boolean) => void
}

const itemsAccordingToRole = {
  graduate: {
    label: 'Nome do Orientador',
    errorMessage: 'egressos',
    notFoundMessage: 'Nenhum egresso encontrado',
  },
  advisor: {
    label: 'Nome do Egresso',
    errorMessage: 'orientadores',
    notFoundMessage: 'Nenhum professor encontrado',
  },
}

export const CourseModal = ({
  courses = [],
  setCourses,
  programs,
  isAddCourseOpen,
  setIsAddCourseOpen,
  isGraduate = true,
}: Props) => {
  const courseDefaultState: CourseInfoType = {
    id: undefined,
    program: undefined,
    graduate: undefined,
    defenseMinute: undefined,
    titleDate: undefined,
    advisor: undefined,
  }
  const keyAccordingToRole = isGraduate ? 'graduate' : 'advisor'
  const [course, setCourse] = useState<CourseInfoType>({
    ...courseDefaultState,
  })

  const [options, setOptions] = useState<UserLean[]>([])
  const [isAutocompleteLoading, setIsAutocompleteLoading] = useState<boolean>(false)
  const onModalClose = () => {
    setIsAddCourseOpen(false)
    setCourse({ ...courseDefaultState })
  }

  const handleSave = () => {
    setCourses([...(courses ?? []), course])
    onModalClose()
  }

  const getData = async (searchTerm: string) => {
    try {
      const result = isGraduate ? await getAdvisors(searchTerm) : await getGraduates(searchTerm)
      setOptions(result)
    } catch (error) {
      showErrorToast(
        `Não foi possível buscar os ${itemsAccordingToRole[keyAccordingToRole]}. Tente novamente mais tarde.`
      )
    }
  }

  const onAdvisorChange = async (_: any, value: string) => {
    setIsAutocompleteLoading(true)
    if (value) {
      await getData(value)
    } else {
      setOptions([])
    }
    setIsAutocompleteLoading(false)
  }

  const checkIfCourseIsValid = !!(
    course.titleDate &&
    course.defenseMinute &&
    course.program?.id &&
    (isGraduate ? course.advisor?.id : course.graduate?.id)
  )

  return (
    <Modal show={isAddCourseOpen} onHide={onModalClose}>
      <Modal.Header closeButton>
        <Fields>{course.id ? 'Editar' : 'Adicionar'} Curso de Pós-graduação</Fields>
      </Modal.Header>
      <Modal.Body>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="program">Programa*</InputLabel>
              <SelectMui
                labelId={'program'}
                id={'program'}
                name={'program'}
                label={'Programa*'}
                value={course.program?.id || ''}
                onChange={event => {
                  if (event.target.value)
                    setCourse(oldCourse => ({
                      ...oldCourse,
                      program: { id: event.target.value as string },
                    }))
                }}
              >
                {programs.map(program => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.label}
                  </MenuItem>
                ))}
              </SelectMui>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Autocomplete
                loading={isAutocompleteLoading}
                renderInput={params => (
                  <InputMui
                    {...params}
                    label={itemsAccordingToRole[keyAccordingToRole].label}
                    variant={'outlined'}
                  />
                )}
                loadingText={'Carregando...'}
                noOptionsText={itemsAccordingToRole[keyAccordingToRole].notFoundMessage}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                options={options}
                onInputChange={onAdvisorChange}
                getOptionLabel={option => option.name}
                value={isGraduate ? course.advisor : course.graduate}
                onChange={(_, value) => {
                  setCourse(oldCourse => ({
                    ...oldCourse,
                    advisor: isGraduate ? value || undefined : undefined,
                    graduate: !isGraduate ? value || undefined : undefined,
                  }))
                }}
                disablePortal
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputMui
                type={'number'}
                value={course.defenseMinute}
                onChange={(event: { target: { value: never } }) =>
                  setCourse(oldCourse => ({
                    ...oldCourse,
                    defenseMinute: event.target.value,
                  }))
                }
                name={'defenseMinute'}
                label={'Minuta de Defesa*'}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <DatePicker
                format={'DD/MM/YYYY'}
                label={'Data de titulação*'}
                value={course.titleDate}
                disableFuture
                onChange={(titleDate: any) => {
                  setCourse(oldCourse => ({
                    ...oldCourse,
                    titleDate,
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
          disableHoverListener={checkIfCourseIsValid}
        >
          <span>
            <Button
              size={'large'}
              variant={'contained'}
              disabled={!checkIfCourseIsValid}
              onClick={handleSave}
            >
              Salvar
            </Button>
          </span>
        </Tooltip>
      </Modal.Footer>
    </Modal>
  )
}
