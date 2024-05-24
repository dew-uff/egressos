import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  ActionIcon,
  Breadcrumbs,
  Button,
  ClearRoundedIcon,
  CustomTable,
  EditRoundedIcon,
  FormContainer,
  FormControl,
  Grid,
  Input,
  MainWrapper,
  Pagination,
  SearchRoundedIcon,
  showErrorToast,
  showSavedToast,
} from '@components'
import { RoleTranslation, Routes, USER_TOKEN_NAME } from '@utils/enums'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { User } from '@context/AuthContext'
import { PaginationType } from '@modules/Commons/types'
import EditAddUserModal from '@modules/UserList/EditAddUserModal'
import { getUsers } from '@modules/UserList/api'
import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const pageSize = 10

interface Props {
  users: User[]
  meta: PaginationType
}

interface FormInfo {
  name?: string
  email?: string
}

const columns = [
  {
    name: 'Nome',
  },
  {
    name: 'E-mail',
  },
  {
    name: 'Papel do Usuário',
  },
  {
    name: 'Ações',
    width: '20%',
  },
]

const breadcrumbs = [
  { name: 'Listagem de Egressos', href: Routes.GRADUATES },
  { name: 'Gerenciamento', href: Routes.MANAGEMENT },
  { name: 'Usuários' },
]

const UserList = ({ users, meta }: Props) => {
  const apiClient = getAPIClient()
  const [usersList, setUsersList] = useState<User[]>(users)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [currentUser] = useState<User>({} as User)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const router = useRouter()
  const formContext = useForm()
  const { getValues, reset } = formContext

  const handleOnCloseUserDialog = () => setShowUserDialog(false)

  const onClickCreateUser = () => {
    router.push(Routes.MANAGEMENT_NEW_USER)
  }

  const handleGetUsers = async (page: number, formInfo?: FormInfo) => {
    try {
      const { meta, data } = await getUsers(apiClient, page, pageSize, formInfo)
      setUsersList(data)
      setPagination(meta)
    } catch (e) {
      showErrorToast('Erro ao buscar usuários.')
    }
  }

  const onSuccess = async () => {
    await handleGetUsers(1)
    showSavedToast()
    setShowUserDialog(false)
  }

  const onClickBack = () => {
    router.push(Routes.MANAGEMENT)
  }

  const onFail = (message: string) => {
    showErrorToast(message)
  }

  const onChangePagination = async (_event: never, value: number) => {
    const form = getValues()
    await handleGetUsers(value, form)
  }
  const onSend = async (form: FormInfo) => {
    try {
      await handleGetUsers(1, form)
    } catch (e) {
      toast.error('Erro ao buscar usuários.')
    }
  }

  const onClean = async () => {
    reset()
    await handleGetUsers(1)
  }

  const handleClickEdit = (id: string) => {
    router.push({ pathname: Routes.MANAGEMENT_USER, query: { id } })
  }

  const rows = usersList?.map(user => [
    { body: user.name },
    { body: user.email },
    {
      body: (
        <Fields>
          {user.roles.length === 1 ? RoleTranslation[user.roles[0]] : RoleTranslation.multiple}
        </Fields>
      ),
    },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handleClickEdit(user.id)}>
            <EditRoundedIcon />
          </ActionIcon>
        </section>
      ),
    },
  ])

  useEffect(() => {
    setUsersList(users)
    setPagination(meta)
  }, [users, meta])

  return (
    <MainWrapper>
      <PageWrapper spacing={2} container direction="column">
        <Grid item>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item xs={12}>
          <Title>Atualizar Informações de Usuário</Title>
        </Grid>
        <Grid item xs={12} minHeight={510}>
          <FormContainer formContext={formContext} onSuccess={onSend}>
            <Grid container spacing={3}>
              <Grid item sx={{ width: '350px' }}>
                <FormControl fullWidth>
                  <Input variant="standard" label="Nome" name="name" />
                </FormControl>
              </Grid>
              <Grid item sx={{ width: '350px' }}>
                <FormControl fullWidth>
                  <Input variant="standard" label="E-mail" name="email" />
                </FormControl>
              </Grid>
              <Grid item alignSelf={'center'}>
                <Button size={'large'} variant="contained" type="submit">
                  <SearchRoundedIcon />
                </Button>
              </Grid>
              <Grid item alignSelf={'center'}>
                <Button size={'large'} variant="outlined" onClick={onClean}>
                  <ClearRoundedIcon />
                </Button>
              </Grid>
              <Grid item xs={12}>
                {rows?.length !== 0 ? (
                  <CustomTable columns={columns} rows={rows} />
                ) : (
                  <Fields>Nenhum resultado encontrado.</Fields>
                )}
              </Grid>
            </Grid>
          </FormContainer>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="right">
            {pagination && rows?.length !== 0 && (
              <Grid item position="absolute" left="50%">
                <Pagination
                  count={Math.ceil(pagination.total / pageSize)}
                  page={pagination.page + 1}
                  onChange={onChangePagination}
                />
              </Grid>
            )}
            <Grid item>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button size={'large'} variant={'contained'} onClick={onClickCreateUser}>
                    Criar Usuário
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
        </Grid>
      </PageWrapper>
      <EditAddUserModal
        onFail={() => onFail('Erro ao cadastrar/atualizar usuário')}
        onSuccess={onSuccess}
        currentUser={currentUser}
        show={showUserDialog}
        handleClose={handleOnCloseUserDialog}
      />
    </MainWrapper>
  )
}

export async function getServerSideProps(ctx) {
  const apiClient = getAPIClient(ctx)
  const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const { data, meta } = await getUsers(apiClient)
  return {
    props: {
      users: data ?? [],
      meta,
    },
  }
}

export default UserList
