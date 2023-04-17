import React, { useEffect } from 'react'
import MainWrapper from '../src/components/MainWrapper'
import { Roles, Theme } from '../src/utils/enums'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import {
  Background,
  Button,
  Content,
  FormInputGroup,
  Form,
  ImageLogo,
  Input,
  Label,
  Title,
} from '../src/styles/index.style'
import fotoIcUff from '../public/fotoicuff.jpg'
import logo from '../public/logo-ic-uff-branca.png'
import Image from 'next/image'
import { useAuth } from '../src/api/AuthProvider'
import styled from 'styled-components'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const FormInputGroupLoginFields = styled(FormInputGroup)`
  width: 320px;
`

const Home: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  // const navigate = useNavigate()
  const router = useRouter()
  const { user } = useAuth()
  const redirectAccordingRole = user => {
    if (user) {
      if (user?.role === Roles.GRADUATE) {
        router.push('/editar')
      } else {
        router.push('/listagem')
      }
    }
  }

  useEffect(() => {
    redirectAccordingRole(user)
  }, [user])

  const onSubmit = async body => {
    console.warn(body)
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await fetch(`${GRADUATE_API}/v1/login`, myInit)
    if (result.status === 200) {
      const response = await fetch(`${GRADUATE_API}/v1/user`, {
        credentials: 'include',
      })
      const profile = await response.json()
      redirectAccordingRole(profile)
    }
  }

  return (
    <>
      <MainWrapper hasHeader={false} themeName={Theme.gray} hasContent={false}>
        <Image src={fotoIcUff} layout="fill" objectFit="cover" />
        <Background>
          <Content>
            <ImageLogo>
              <Image src={logo} width="370" height="265" layout="fixed" />
            </ImageLogo>
            <Title>Sistema de Egressos</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form>
                <FormInputGroupLoginFields>
                  <Input placeholder="Email" {...register('email', { required: true })} />
                  <Label htmlFor="email">Email</Label>
                </FormInputGroupLoginFields>
                <FormInputGroupLoginFields>
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...register('password', { required: true })}
                  />
                  <Label htmlFor="password">Senha</Label>
                </FormInputGroupLoginFields>
                <a>
                  <FormInputGroupLoginFields>
                    <Button type="submit">Continuar</Button>
                  </FormInputGroupLoginFields>
                </a>
              </Form>
            </form>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Home
