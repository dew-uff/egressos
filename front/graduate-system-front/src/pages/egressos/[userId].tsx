import React, { useEffect, useMemo } from 'react'
import { Role, Routes, Theme, USER_TOKEN_NAME } from '@utils/enums'

import {
  AcademicInfo,
  Fields,
  getGraduateInfoAndWorkHistory,
  GraduateWorkHistoriesInfo,
  InstitutionalLinkInfo,
  PersonalInfo,
  saveWorkHistory,
} from '@modules/WorkHistoryEdit'
import { getAPIClient } from '@services/axios'
import nookies from 'nookies'
import { SelectItem } from '@utils/types'
import { getCNPQLevelsOptions, getInstitutionTypesOptions } from '@modules/Commons/api'
import { useRouter } from 'next/router'
import { useAuth } from '@context/AuthProvider'
import { useForm } from 'react-hook-form'
import { transformNumberToValue } from '@utils/functions'
import { Breadcrumbs, Button, Grid, MainWrapper, showErrorToast, showSavedToast } from '@components'
import { PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'

interface Props {
  cnpqLevels: SelectItem[]
  graduateInfo: GraduateWorkHistoriesInfo
  hasCurrentCNPQScholarship: number
  hasCurrentWorkHistory: number
  hasPostDoctorate: number
  institutionTypes: SelectItem[]
}

const GraduateUser = ({
  cnpqLevels,
  graduateInfo,
  hasCurrentCNPQScholarship,
  hasPostDoctorate,
  hasCurrentWorkHistory,
  institutionTypes,
}: Props) => {
  const router = useRouter()
  const { currentRole } = useAuth()
  const isNotGraduate = currentRole !== Role.GRADUATE
  const formContext = useForm({
    defaultValues: useMemo(() => {
      return {
        ...graduateInfo,
        cnpqScholarships: [],
        currentCNPQScholarships: [],
        currentInstitutionalLinks: [],
        hasCurrentCNPQScholarship,
        hasCurrentWorkHistory,
        hasPostDoctorate,
        institutionalLinks: [],
        postDoctorate: {
          id: graduateInfo.postDoctorate?.id,
          startedAt: graduateInfo.postDoctorate?.startedAt,
          endedAt: graduateInfo.postDoctorate?.endedAt,
          institution: {
            id: graduateInfo.postDoctorate?.institution?.id,
            name: graduateInfo.postDoctorate?.institution?.name,
            typeId: graduateInfo.postDoctorate?.institution?.typeId,
          },
        },
      }
    }, [graduateInfo]),
  })
  const { reset, control } = formContext

  useEffect(() => {
    reset({
      ...graduateInfo,
      cnpqScholarships: [],
      currentCNPQScholarships: [],
      currentInstitutionalLinks: [],
      hasCurrentCNPQScholarship,
      hasCurrentWorkHistory,
      hasPostDoctorate,
      institutionalLinks: [],
      postDoctorate: {
        id: graduateInfo.postDoctorate?.id,
        startedAt: graduateInfo.postDoctorate?.startedAt,
        endedAt: graduateInfo.postDoctorate?.endedAt,
        institution: {
          id: graduateInfo.postDoctorate?.institution?.id,
          name: graduateInfo.postDoctorate?.institution?.name,
          typeId: graduateInfo.postDoctorate?.institution?.typeId,
        },
      },
    })
  }, [graduateInfo])

  const onSend = async data => {
    const {
      graduateId,
      graduateName,
      email,
      postDoctorate,
      successCase,
      cnpqScholarships,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
      hasCurrentWorkHistory,
      hasCurrentCNPQScholarship,
      hasPostDoctorate,
      institutionalLinks,
      workHistories,
    } = data

    const body = {
      cnpqScholarships,
      email,
      graduateName,
      hasCurrentCNPQScholarship: transformNumberToValue(hasCurrentCNPQScholarship),
      hasCurrentWorkHistory: transformNumberToValue(hasCurrentWorkHistory),
      hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF
        ? hasFinishedDoctorateOnUFF === 'true'
        : graduateInfo?.hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF
        ? hasFinishedMasterDegreeOnUFF === 'true'
        : graduateInfo?.hasFinishedMasterDegreeOnUFF,
      hasPostDoctorate: transformNumberToValue(hasPostDoctorate),
      postDoctorate: hasPostDoctorate === 1 ? postDoctorate : null,
      successCase,
      workHistories: [...institutionalLinks, ...workHistories],
    }

    try {
      await saveWorkHistory(graduateId, body)
      showSavedToast()
      if (isNotGraduate) {
        await router.push(Routes.GRADUATES)
      }
    } catch (err) {
      showErrorToast('Ocorreu algum erro ao salvar. Tente novamente.')
    }
  }

  const onError = () => {
    showErrorToast(
      <div>
        {'Existem campos pendentes.'}
        <br />
        {'Por favor, preencha-os para continuar.'}
      </div>
    )
  }

  return (
    <MainWrapper themeName={Theme.white}>
      <PageWrapper container spacing={3}>
        {isNotGraduate && (
          <Grid item>
            <Breadcrumbs
              breadcrumbs={[
                { name: 'Listagem de Egressos', href: Routes.GRADUATES },
                { name: 'Histórico do Egressos' },
              ]}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Title>Registro de Histórico do Egresso</Title>
        </Grid>
        <Grid item>
          <FormContainer formContext={formContext} onSuccess={onSend} onError={onError}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <PersonalInfo />
              </Grid>
              <Grid item xs={12}>
                <InstitutionalLinkInfo control={control} institutionTypes={institutionTypes} />
              </Grid>
              <Grid item xs={12}>
                <AcademicInfo
                  control={control}
                  cnpqLevels={cnpqLevels}
                  graduateInfo={graduateInfo}
                  institutionTypes={institutionTypes}
                />
              </Grid>
              <p>{}</p>
              <Grid item xs={12} alignSelf={'center'}>
                <Grid container justifyContent={'center'} columnSpacing={3}>
                  {currentRole !== Role.GRADUATE ? (
                    <Grid item>
                      <Button
                        size={'large'}
                        variant="outlined"
                        onClick={() => router.push(Routes.GRADUATES)}
                      >
                        Voltar
                      </Button>
                    </Grid>
                  ) : null}

                  <Grid item>
                    <Button size="large" variant="contained" type="submit">
                      Salvar
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

export async function getServerSideProps(ctx) {
  const { userId } = ctx.query
  const apiClient = getAPIClient(ctx)
  const cookies = nookies.get(ctx)

  if (!cookies[USER_TOKEN_NAME]) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const promises = [
    getGraduateInfoAndWorkHistory(apiClient, userId),
    getInstitutionTypesOptions(apiClient),
    getCNPQLevelsOptions(apiClient),
  ]

  const response = await Promise.all(promises)

  const someResult = response.some(item => 'response' in item && item.response?.status === 403)
  if (someResult)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  const [graduateInfo, institutionTypes, cnpqLevels] = response

  const graduateInfoParsed = graduateInfo as GraduateWorkHistoriesInfo

  const getIfHasField = (field: Fields) => {
    return graduateInfoParsed.pendingFields.includes(field)
      ? -1
      : graduateInfoParsed.emptyFields.includes(field)
      ? 0
      : 1
  }

  const hasCurrentCNPQScholarship = getIfHasField(Fields.CNPQ_SCHOLARSHIP)
  const hasPostDoctorate = getIfHasField(Fields.POST_DOCTORATE)
  const hasCurrentWorkHistory = getIfHasField(Fields.WORK_HISTORY)

  return {
    props: {
      graduateInfo,
      institutionTypes,
      cnpqLevels,
      hasCurrentCNPQScholarship,
      hasPostDoctorate,
      hasCurrentWorkHistory,
    },
  }
}

export default GraduateUser
