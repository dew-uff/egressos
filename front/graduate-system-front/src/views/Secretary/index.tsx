import React, { useEffect } from 'react'
import Head from 'next/head'
import MainWrapper from '../../components/MainWrapper'
import { Theme } from '../../utils/enums'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Background,
  Content,
  Subtitle,
  Fields,
  Button,
  Button2,
  Title,
  FormEditar,
  Label2,
} from './index.style'
import Link from 'next/link'
import MainHeader from '../../components/MainHeader'
import { FormInputGroup, Input, Label } from '../../styles/index.style'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Secretaria: React.FC = () => {
  const notify = () => toast.success('Alteração salva com sucesso!')
  const [possuiVinculo, setPossuiVinculo] = React.useState('')
  const [bolsistaCNPQ, setBolsistaCNPQ] = React.useState('')
  const [concluiuMestrado, setConcluiuMestrado] = React.useState('')
  const [concluiuDoutorado, setConcluiuDoutorado] = React.useState('')
  const [concluiuPosDoutorado, setConcluiuPosDoutorado] = React.useState('')
  const [casoSucesso, setCasoSucesso] = React.useState('')
  const [cnpqLevels, setCnpqLevels] = React.useState([])
  const ehDoutor = false
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
  }

  const getCnpqLevels = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
      credentials: 'include',
    })
    const result = await response.json()
    setCnpqLevels(result)
  }

  useEffect(() => {
    ;(async () => {
      await getCnpqLevels()
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false}>
        <Background>
          <MainHeader />
          <Content>
            <Title>Editar Dados do Egresso</Title>
            <FormEditar>
              <form className="formSecretaria" onSubmit={handleSubmit(onSubmit)} method="post">
                <div className="row">
                  <div className="columnsecretaria">
                    <FormInputGroup>
                      <Input
                        defaultValue="160"
                        type="number"
                        required
                        min="1"
                        {...register('nAta', { required: true })}
                      />
                      <Label htmlFor="nAta">Nº ata da defesa</Label>
                    </FormInputGroup>
                    <FormInputGroup>
                      <Input defaultValue="2020-12-17" id="date" type="date" />
                      <Label>Data da titulação</Label>
                    </FormInputGroup>
                    <FormInputGroup>
                      <Input
                        defaultValue="Igor Monteiro Moraes"
                        type="text"
                        pattern="[^0-9]*"
                        title="O campo deve possuir apenas letras."
                        required
                      />
                      <Label>Orientador</Label>
                    </FormInputGroup>
                    {/* <FormInputGroup> */}
                    {/*  <Input defaultValue="PGC" required pattern="PGC|CAA" title="Preencha com um dos dois programas PGC ou CAA."/> */}
                    {/*  <Label>Nome do Programa</Label> */}
                    {/* </FormInputGroup> */}
                    <FormInputGroup>
                      <Input
                        defaultValue="luizars@id.uff.br"
                        type="email"
                        title="Digite um e-mail válido."
                        pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
                        required
                      />
                      <Label>E-mail</Label>
                    </FormInputGroup>
                  </div>
                  <div className="columnsecretaria">
                    <FormInputGroup>
                      <input
                        className="radioInput2"
                        type="radio"
                        id="html"
                        name="fav_language"
                        value="Possui Vínculo Institucional"
                        onChange={e => setPossuiVinculo(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="html">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="css"
                        name="fav_language"
                        value="Sem Vínculo Institucional"
                        onChange={e => setPossuiVinculo(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="css">
                        Não{' '}
                      </label>
                      <Label2>Possui vínculo institucional ?</Label2>
                    </FormInputGroup>
                    {possuiVinculo === 'Possui Vínculo Institucional' && (
                      <div>
                        <FormInputGroup>
                          <select name="select">
                            <option value="valor1">Universidade Federal</option>
                            <option value="valor2" selected>
                              Instituto Federal
                            </option>
                            <option value="valor3">Instituição Estadual</option>
                            <option value="valor4">Instituição Particular</option>
                            <option value="valor5">Organizações Públicas</option>
                            <option value="valor6">
                              Empresas ou outras instituições no Brasil
                            </option>
                            <option value="valor7">
                              Empresas ou outras instituições no exterior
                            </option>
                            <option value="valor8">Outros (Bolsista, Tutor, etc)</option>
                          </select>
                          <Label2>Tipo de Instituição</Label2>
                        </FormInputGroup>
                        <FormInputGroup>
                          <Input placeholder="Local de Trabalho" defaultValue="Globo" required />
                          <Label>Nome da Instituição</Label>
                        </FormInputGroup>
                        <FormInputGroup>
                          <Input
                            placeholder="Cargo"
                            defaultValue="Analista"
                            pattern="[^0-9]*"
                            title="O campo deve possuir apenas letras."
                            required
                          />
                          <Label>Cargo</Label>
                        </FormInputGroup>
                      </div>
                    )}
                  </div>
                  <div className="columnsecretaria">
                    <FormInputGroup>
                      <input
                        className="radioInput2"
                        type="radio"
                        id="simcnpq"
                        name="fav_language2"
                        value="Possui cnpq"
                        onChange={e => setBolsistaCNPQ(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="simcnpq">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="naocnpq"
                        name="fav_language2"
                        value="Nao possui cnpq"
                        onChange={e => setBolsistaCNPQ(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="naocnpq">
                        Não{' '}
                      </label>
                      <Label2>É bolsista CNPQ ?</Label2>
                    </FormInputGroup>
                    {bolsistaCNPQ === 'Possui cnpq' && (
                      <div>
                        <FormInputGroup>
                          <select name="select">
                            {cnpqLevels.map(level => (
                              <option key={level.id} value={level.id}>
                                {level.level}
                              </option>
                            ))}
                          </select>
                          <Label2>Nível CNPQ</Label2>
                        </FormInputGroup>
                      </div>
                    )}
                    <FormInputGroup>
                      <input
                        className="radioInput2"
                        type="radio"
                        id="concluiu"
                        name="fav_language3"
                        value="Concluiu doutorado"
                        onChange={e => setConcluiuDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="concluiu">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="naoConcluiu"
                        name="fav_language3"
                        value="Nao concluiu doutorado"
                        onChange={e => setConcluiuDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="naoConcluiu">
                        Não{' '}
                      </label>
                      <Label2 style={!ehDoutor ? { display: 'block' } : { display: 'none' }}>
                        Concluiu o doutorado da PGC/UFF ?
                      </Label2>
                      <Label2 style={ehDoutor ? { display: 'block' } : { display: 'none' }}>
                        Concluiu o mestrado da PGC ou CAA - UFF ?
                      </Label2>
                    </FormInputGroup>
                    <FormInputGroup>
                      <input
                        className="radioInput2"
                        type="radio"
                        id="posdoc"
                        name="fav_language4"
                        value="Concluiu doutorado"
                        onChange={e => setConcluiuPosDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="posdoc">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="naoposdoc"
                        name="fav_language4"
                        value="Nao concluiu doutorado"
                        onChange={e => setConcluiuPosDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="naoposdoc">
                        Não{' '}
                      </label>
                      <Label2>Tem pós-doutorado ?</Label2>
                    </FormInputGroup>
                    <FormInputGroup>
                      <input
                        className="radioInput2"
                        type="radio"
                        id="sucesso"
                        name="fav_language5"
                        value="Concluiu doutorado"
                        onChange={e => setCasoSucesso(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="sucesso">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="naosucesso"
                        name="fav_language5"
                        value="Nao concluiu doutorado"
                        onChange={e => setCasoSucesso(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="naosucesso">
                        Não{' '}
                      </label>
                      <Label2>Caso de sucesso ?</Label2>
                    </FormInputGroup>
                  </div>
                </div>
                <FormInputGroup>
                  <Link href={'/egressos'} as="/egressos">
                    <Button2 type="submit">Voltar</Button2>
                  </Link>
                  <Button type="submit">Salvar Alterações</Button>
                  <ToastContainer position="top-center" />
                </FormInputGroup>
              </form>
            </FormEditar>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Secretaria
