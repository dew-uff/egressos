import { PageWrapper, Title } from '@styles/index.style'
import { Breadcrumbs, Button, Grid, MainWrapper, showErrorToast, showSavedToast } from '@components'
import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import {
  CoursesInfoAdvisor,
  CoursesInfoGraduate,
  UserInfo as UserInfoComponent,
} from '@modules/User'
import { getAPIClient } from '@services/axios'
import { CreateCourse, createUpdateUser, getUser, UserInfo } from '@modules/User/api'
import { Role, Routes } from '@utils/enums'
import { getInstitutionTypesOptions } from '@modules/Commons/api'
import { SelectItem } from '@utils/types'
import { getPrograms } from '@modules/Programs/api'
import { Course } from '@modules/WorkHistoryEdit'

interface UserEdit {
  hasPostDoctorate?: number
  hasCNPQScholarship?: number
  hasFinishedDoctorateOnUFF?: number
  hasFinishedMasterDegreeOnUFF?: number
}

interface Props {
  user: UserInfo & UserEdit
  programs: SelectItem[]
}

const defaultValues: UserInfo = {
  user: {
    id: undefined,
    name: undefined,
    email: undefined,
    roles: [],
  },
  graduate: {
    id: undefined,
    courses: [],
    newCourses: [],
  },
  advisor: {
    id: undefined,
    courses: [],
    newCourses: [],
  },
}

const validateCourses = (role: Role, formValues: UserInfo, value?: Course[]) => {
  const roles = formValues.user?.roles ?? []
  return (
    !roles?.includes(role) ||
    !!value?.length ||
    !!(role === Role.GRADUATE && formValues.graduate?.newCourses) ||
    !!(role === Role.PROFESSOR && formValues.advisor?.newCourses) ||
    'Adicione pelo menos um curso.'
  )
}

const extractCourseInfoFromForm = (course: Course): CreateCourse => ({
  id: course.id,
  program: course.program?.id,
  defenseMinute: course.defenseMinute,
  titleDate: course.titleDate,
  graduate: course.graduate?.id,
  advisor: course.advisor?.id,
})

const UserDetail = ({ user, programs }: Props) => {
  const router = useRouter()
  const { id } = router.query
  const isNewUser = id === 'novo'
  const getDefaultFormValues = useMemo(
    () => (Object.keys(user).length === 0 ? defaultValues : user),
    [user]
  )
  const formContext = useForm({
    defaultValues: getDefaultFormValues,
  })
  const {
    register,
    reset,
    control,
    watch,
    formState: { isValid: isFormValid },
  } = formContext

  register('graduate.courses', {
    validate: (value, formValues) => validateCourses(Role.GRADUATE, formValues, value),
  })
  register('advisor.courses', {
    validate: (value, formValues) => validateCourses(Role.PROFESSOR, formValues, value),
  })

  const roles = watch('user.roles')
  const isUserGraduate = roles?.includes(Role.GRADUATE)
  const isUserAdvisor = roles?.includes(Role.PROFESSOR)
  const handleSubmit = async event => {
    const { user, graduate, advisor } = event
    const graduateCourses = [...(graduate?.courses ?? []), ...(graduate?.newCourses ?? [])]
    const advisorCourses = [...(advisor?.courses ?? []), ...(advisor?.newCourses ?? [])]
    const payload = {
      user,
      graduate: {
        id: graduate?.id,
        courses: graduateCourses.map(course => extractCourseInfoFromForm(course)),
      },
      advisor: {
        id: advisor?.id,
        courses: advisorCourses.map(course => extractCourseInfoFromForm(course)),
      },
    }
    try {
      await createUpdateUser(payload)
      showSavedToast()
      await router.push(Routes.MANAGEMENT_USERS)
    } catch (e) {
      showErrorToast('Erro ao salvar usuário. Tente novamente mais tarde.')
    }
  }

  const breadcrumbs = [
    { name: 'Listagem de Egressos', href: Routes.GRADUATES },
    { name: 'Gerenciamento', href: Routes.MANAGEMENT },
    { name: 'Usuários', href: Routes.MANAGEMENT_USERS },
    { name: `${isNewUser ? 'Adição' : 'Edição'} de Usuário` },
  ]

  const onClickBack = () => {
    router.push(Routes.MANAGEMENT_USERS)
  }

  useEffect(() => {
    reset(user)
  }, [user])

  return (
    <MainWrapper>
      <PageWrapper container rowSpacing={3}>
        <Grid item>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item xs={12}>
          <Title>{isNewUser ? 'Adicionar' : 'Editar'} Usuário</Title>
        </Grid>
        <Grid item>
          <FormContainer formContext={formContext} onSuccess={handleSubmit}>
            <Grid container rowSpacing={4}>
              <Grid item xs={12}>
                <UserInfoComponent control={control} />
              </Grid>
              {isUserGraduate && (
                <Grid item xs={12}>
                  <CoursesInfoGraduate
                    control={control}
                    programs={programs}
                    historyCourses={user.graduate?.courses}
                  />
                </Grid>
              )}
              {isUserAdvisor && (
                <Grid item xs={12}>
                  <CoursesInfoAdvisor
                    control={control}
                    programs={programs}
                    historyCourses={user.advisor?.courses}
                  />
                </Grid>
              )}
              <Grid item xs={12} alignSelf={'center'}>
                <Grid container justifyContent={'center'} columnSpacing={2}>
                  <Grid item>
                    <Button
                      disabled={!isFormValid}
                      type={'submit'}
                      size={'large'}
                      variant={'contained'}
                    >
                      Salvar
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button size={'large'} variant={'outlined'} onClick={onClickBack}>
                      Voltar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormContainer>
        </Grid>
      </PageWrapper>
    </MainWrapper>
  )
}
export default UserDetail

export async function getServerSideProps(ctx) {
  const { id } = ctx.query

  const apiClient = getAPIClient(ctx)

  try {
    const user = id === 'novo' ? {} : await getUser(id, apiClient)
    const institutionTypes = await getInstitutionTypesOptions(apiClient)
    const programs = await getPrograms(apiClient)

    const programsOptions = programs.map(program => ({
      id: program.id,
      label: program.initials,
    }))

    return {
      props: {
        user,
        institutionTypes,
        programs: programsOptions,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
