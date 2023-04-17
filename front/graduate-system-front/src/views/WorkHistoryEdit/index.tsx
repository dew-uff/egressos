import React, { Fragment, useEffect, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Theme } from '../../utils/enums'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Button,
  Title,
  Checkbox,
  FormInputGroupEdit,
  Select,
  Subtitle,
  LabelSelect,
  SectionEdit,
  InputEditar,
} from './index.style'
import { useAuth } from '../../api/AuthProvider'
import { useRouter } from 'next/router'
import {
  FormInputGroup,
  Form,
  Input,
  CheckboxLabel,
  Section,
  Label,
} from '../../styles/index.style'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Editar: React.FC = () => {
  const notify = () => toast.success('Alteração salva com sucesso!')
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState(false)
  const [hasCNPQScholarship, setHasCNPQScholarship] = useState(false)
  const [hasPostDoctorate, setHasPostDoctorate] = useState(false)
  const [institutionTypes, setInstitutionTypes] = useState([])
  const [cnpqLevels, setCNPQLevels] = useState([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const getInstitutionTypes = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
        credentials: 'include',
      })
      const result = await response.json()
      setInstitutionTypes(result)
    }
    const getCNPQLevels = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
        credentials: 'include',
      })
      const result = await response.json()
      setCNPQLevels(result)
    }
    getInstitutionTypes()
    getCNPQLevels()
  }, [])

  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
  }
  const { user } = useAuth()
  const router = useRouter()

  return (
    <>
      <MainWrapper themeName={Theme.white}>
        <Title>Registro de Histórico do Egresso</Title>
        <Form position="left">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Subtitle>Informações pessoais</Subtitle>
              <SectionEdit>
                <FormInputGroupEdit>
                  <InputEditar
                    defaultValue={user?.email}
                    placeholder="E-mail"
                    type="email"
                    title="Digite um e-mail válido."
                    pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
                    required
                    {...register('email', { required: true })}
                  />
                  <Label htmlFor="email">E-mail</Label>
                </FormInputGroupEdit>
              </SectionEdit>
            </div>

            <div>
              <Subtitle>Informações sobre vínculo institucional</Subtitle>
              <Section>
                <Checkbox
                  type="checkbox"
                  id="institutionalLink"
                  checked={hasInstitutionalLink}
                  onChange={() => setHasInstitutionalLink(!hasInstitutionalLink)}
                />
                <CheckboxLabel htmlFor="institutionalLink">
                  Possui vínculo institucional
                </CheckboxLabel>
              </Section>
              {hasInstitutionalLink && (
                <Fragment>
                  <SectionEdit>
                    <FormInputGroupEdit>
                      <InputEditar
                        placeholder="Nome da instituição"
                        defaultValue={user?.institution?.name}
                        required
                        {...register('institution.name', { required: true })}
                      />
                      <Label htmlFor="institution.name">Nome da instituição</Label>
                    </FormInputGroupEdit>
                    <FormInputGroupEdit>
                      <LabelSelect htmlFor="institutionType">Tipo de Instituição</LabelSelect>
                      <Select {...register('institution.type')}>
                        {institutionTypes.map((institutionType: any) => (
                          <option key={institutionType.id} value={institutionType.id}>
                            {institutionType.name}
                          </option>
                        ))}
                      </Select>
                    </FormInputGroupEdit>
                    <FormInputGroupEdit>
                      <InputEditar
                        placeholder="Cargo"
                        defaultValue={user?.position}
                        pattern="[^0-9]*"
                        title="O campo deve possuir apenas letras."
                        required
                        {...register('position', { required: true })}
                      />
                      <Label>Cargo</Label>
                    </FormInputGroupEdit>
                  </SectionEdit>
                </Fragment>
              )}
            </div>

            <div>
              <Subtitle>Informações acadêmicas</Subtitle>
            </div>
            <Section>
              <Checkbox
                type="checkbox"
                id="hasFinishedMasterDegreeOnUFF"
                checked={hasPostDoctorate}
                onChange={() => setHasPostDoctorate(!hasPostDoctorate)}
              />
              <CheckboxLabel htmlFor="hasFinishedMasterDegreeOnUFF">
                Tem pós-doutorado?
              </CheckboxLabel>
            </Section>
            {hasPostDoctorate && (
              <Fragment>
                <SectionEdit>
                  <FormInputGroupEdit>
                    <InputEditar
                      placeholder="Nome da instituição"
                      defaultValue={null}
                      required
                      {...register('postDoctorate.name', { required: true })}
                    />
                    <Label htmlFor="postDoctorate.name">Nome da instituição</Label>
                  </FormInputGroupEdit>
                  <FormInputGroupEdit>
                    <LabelSelect htmlFor="postDoctorate.type">Tipo de Instituição</LabelSelect>
                    <Select {...register('postDoctorate.type')}>
                      {institutionTypes.map((institutionType: any) => (
                        <option key={institutionType.id} value={institutionType.id}>
                          {institutionType.name}
                        </option>
                      ))}
                    </Select>
                  </FormInputGroupEdit>
                </SectionEdit>
              </Fragment>
            )}
            <Section>
              <Checkbox
                type="checkbox"
                id="hasCNPQScholarship"
                checked={hasCNPQScholarship}
                onChange={() => setHasCNPQScholarship(!hasCNPQScholarship)}
              />
              <CheckboxLabel htmlFor="hasCNPQScholarship">Possui Bolsa CNPQ</CheckboxLabel>
            </Section>
            {hasCNPQScholarship && (
              <Fragment>
                <SectionEdit>
                  <FormInputGroupEdit>
                    <LabelSelect htmlFor="cnpqLevelId">Bolsa CNPQ</LabelSelect>
                    <Select {...register('cnpqLevelId')}>
                      {cnpqLevels.map((level: any) => (
                        <option key={level.id} value={level.id}>
                          {level.level}
                        </option>
                      ))}
                    </Select>
                  </FormInputGroupEdit>
                </SectionEdit>
              </Fragment>
            )}
            <Section>
              <Checkbox
                type="checkbox"
                id="hasFinishedDoctorateOnUFF"
                {...register('hasFinishedDoctorateOnUFF')}
              />
              <CheckboxLabel htmlFor="hasFinishedDoctorateOnUFF">
                Concluiu o doutorado da PGC/UFF?
              </CheckboxLabel>
            </Section>
            <Section>
              <Checkbox
                type="checkbox"
                id="hasFinishedMasterDegreeOnUFF"
                {...register('hasFinishedMasterDegreeOnUFF')}
              />
              <CheckboxLabel htmlFor="hasFinishedMasterDegreeOnUFF">
                Concluiu o mestrado da PGC ou CAA - UFF ?
              </CheckboxLabel>
            </Section>
            <FormInputGroup>
              <Button onClick={notify} type="submit">
                Salvar Alterações
              </Button>
              <ToastContainer position="top-center" />
            </FormInputGroup>
          </form>
        </Form>
      </MainWrapper>
    </>
  )
}

export default Editar
