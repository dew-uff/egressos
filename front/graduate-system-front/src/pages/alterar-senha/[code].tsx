import React, { useState } from 'react'
import { changePassword, getResetPasswordCode } from '@modules/Login/api'
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputMui,
  MainWrapper,
  Typography,
  InputAdornment,
  VisibilityRounded,
  VisibilityOffRounded,
  showSuccessToast,
  showErrorToast,
} from '@components'
import Image from 'next/image'
import fotoIcUff from '@public/fotoicuff.jpg'
import { Background } from '@styles/index.style'
import { isNullOrUndefinedOrEmpty, passwordIsValid } from '@utils/functions'
import { useRouter } from 'next/router'
import { Routes } from '@utils/enums'

interface PasswordInputProps {
  fieldName: string
  label: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  helperText?: string
  error?: boolean
}
const PasswordInput = ({
  error,
  fieldName,
  label,
  onChange,
  value,
  helperText,
}: PasswordInputProps) => {
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword(show => !show)
  return (
    <FormControl fullWidth>
      <InputMui
        error={error}
        value={value}
        onChange={onChange}
        id={fieldName}
        type={showPassword ? 'text' : 'password'}
        helperText={helperText}
        label={label}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  )
}

const ErrorPage = () => {
  return (
    <MainWrapper hasHeader={false} hasContent={false}>
      <Box height="100%">
        <Grid
          container
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item>
            <Typography variant="h2">Alterar senha</Typography>
          </Grid>
          <Grid item>
            <Typography>O link para alteração de senha expirou. Solicite um novo link.</Typography>
          </Grid>
        </Grid>
      </Box>
    </MainWrapper>
  )
}

const helperPassword =
  'A senha deve conter no mínimo 8 caracteres, com pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'

const getErrorMessage = (value: string, confirmValue: string) => {
  if (value !== confirmValue) return 'As senhas não coincidem.'
  if (!passwordIsValid(value)) return helperPassword
  return ''
}
interface Props {
  isExpired: boolean
}

const ChangePassword = ({ isExpired }: Props) => {
  const [password, setPassword] = useState({ value: '', confirmValue: '' })
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const code = router.query.code as string

  const handleOnChangePassword = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(oldPassword => ({ ...oldPassword, value }))
    const errorMessage = getErrorMessage(value, password.confirmValue)
    setError(errorMessage)
  }

  const handleOnChangePasswordConfirm = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmValue = e.target.value
    setPassword(oldPassword => ({ ...oldPassword, confirmValue }))
    const errorMessage = getErrorMessage(password.value, confirmValue)
    setError(errorMessage)
  }

  const handleSubmit = async () => {
    try {
      await changePassword(code, password.value)
      showSuccessToast(
        'Senha alterada com sucesso. Você será redirecionado para a página de login.'
      )
      setTimeout(() => {
        router.push(Routes.LOGIN)
      }, 3000)
    } catch (e) {
      showErrorToast(e.response.data)
    }
  }

  if (isExpired) return <ErrorPage />

  return (
    <MainWrapper hasHeader={false} hasContent={false}>
      <Image
        alt={'Fotografia do IC UFF'}
        src={fotoIcUff}
        style={{ objectFit: 'cover', overflow: 'hidden' }}
        fill
        priority
      />
      <Background>
        <Grid
          container
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Grid item textAlign="center">
            <Typography variant="h3" color="white">
              Sistema de Egressos
            </Typography>
            <Typography py={2} variant="h5" color="white">
              Redefinição de Senha
            </Typography>
          </Grid>
          <Grid item>
            <Box width="360px" p={4} sx={{ backgroundColor: '#ffffffd6', borderRadius: 6 }}>
              <Grid container direction={'column'} spacing={4} alignItems={'center'}>
                <Grid item width={'100%'}>
                  <FormControl fullWidth>
                    <PasswordInput
                      error={!isNullOrUndefinedOrEmpty(error)}
                      fieldName="password"
                      label="Senha"
                      onChange={handleOnChangePassword}
                      value={password.value}
                      helperText={error}
                    />
                  </FormControl>
                </Grid>
                <Grid item width={'100%'}>
                  <FormControl fullWidth>
                    <PasswordInput
                      error={!isNullOrUndefinedOrEmpty(error)}
                      fieldName="confirm-password"
                      label="Confirme a senha"
                      onChange={handleOnChangePasswordConfirm}
                      value={password.confirmValue}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    {helperPassword}
                  </Typography>
                </Grid>
                <Grid item>
                  <FormControl>
                    <Button
                      size={'large'}
                      disabled={!isNullOrUndefinedOrEmpty(error)}
                      variant="contained"
                      onClick={handleSubmit}
                    >
                      Continuar
                    </Button>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Background>
    </MainWrapper>
  )
}

export const getServerSideProps = async ({ params: { code } }) => {
  try {
    const data = await getResetPasswordCode(code)
    return {
      props: { data },
    }
  } catch (e) {
    return {
      props: { isExpired: true },
    }
  }
}

export default ChangePassword
