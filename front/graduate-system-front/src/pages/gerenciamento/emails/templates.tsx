import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  ActionIcon,
  Breadcrumbs,
  Button,
  ClearRoundedIcon,
  CustomTable,
  DeleteForeverRoundedIcon,
  DeleteItem,
  DeleteModal,
  EditRoundedIcon,
  FormContainer,
  FormControl,
  Grid,
  MainWrapper,
  Pagination,
  SearchRoundedIcon,
  SendRoundedIcon,
  showDeletedToast,
  showErrorToast,
  showSavedToast,
  Select,
  Tooltip,
} from '@components'
import { Role, RoleTranslation, Routes, USER_TOKEN_NAME } from '@utils/enums'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'
import { deleteEmail, getEmails, saveEmail, updateEmail } from '@modules/Emails/api'
import { Email } from '@modules/Emails/types'
import { PaginationType } from '@modules/Commons/types'
import EditModal from '@modules/Emails/EditModal'
import SendEmailModal from '@modules/Emails/SendEmailModal'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const pageSize = 10

export interface FormInfo {
  name?: string
  userRole?: Role | 'null'
}

const defaultValues: FormInfo = {
  name: '',
  userRole: 'null',
}

interface Props {
  emails: Email[]
  meta: PaginationType
}

const emailInitialState: Email = {
  buttonText: '',
  buttonURL: '',
  content: '',
  id: undefined,
  userRole: Role.GRADUATE,
  name: '',
  title: '',
  active: false,
}

const getRowInfo = (
  email: Email,
  onClickSend: React.MouseEventHandler<HTMLButtonElement> | undefined,
  onClickEdit: React.MouseEventHandler<HTMLButtonElement> | undefined,
  onClickDelete: React.MouseEventHandler<HTMLButtonElement> | undefined
) => [
  {
    body: email.name,
  },
  {
    body: RoleTranslation[email.userRole],
  },
  {
    body: email.title,
  },
  {
    body: (
      <section>
        <Tooltip title="Enviar email">
          <ActionIcon disabled={email.userRole === Role.ADMIN} onClick={onClickSend}>
            <SendRoundedIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip title="Editar template">
          <ActionIcon onClick={onClickEdit}>
            <EditRoundedIcon />
          </ActionIcon>
        </Tooltip>
        {email.id && (
          <Tooltip title="Excluir template">
            <ActionIcon onClick={onClickDelete}>
              <DeleteForeverRoundedIcon />
            </ActionIcon>
          </Tooltip>
        )}
      </section>
    ),
  },
]

const roles = [
  { id: 'null', label: RoleTranslation.null },
  ...Object.keys(Role)
    .filter(item => {
      return isNaN(Number(item))
    })
    .map(role => ({ id: role, label: RoleTranslation[role] })),
]

const EmailConfig = ({ emails, meta }: Props) => {
  const [emailsList, setEmailsList] = useState<Email[]>(emails)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [previousEmail, setPreviousEmail] = useState<Email>(emailInitialState)
  const [currentEmail, setCurrentEmail] = useState<Email>(emailInitialState)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>({ id: undefined, value: undefined })
  const router = useRouter()
  const formContext = useForm({ defaultValues })
  const { reset } = formContext

  const handleCloseEditModal = () => setIsEditModalOpen(false)
  const handleCloseSendModal = () => setIsSendModalOpen(false)
  const handleShowEdit = () => setIsEditModalOpen(true)
  const handleClickBack = () => {
    router.push(Routes.MANAGEMENT)
  }

  const cleanEmailFields = () => {
    setCurrentEmail(emailInitialState)
    setPreviousEmail(emailInitialState)
  }

  useEffect(() => {
    setEmailsList(emails)
  }, [emails])

  useEffect(() => {
    setPagination(meta)
  }, [meta])

  const handleChangePagination = async (page: number, form?: FormInfo) => {
    try {
      const { data, meta } = await getEmails(pageSize, page, form)
      setEmailsList(data)
      setPagination(meta)
    } catch (error) {
      showErrorToast('Erro ao trocar de página')
    }
  }

  const handleDeleteEmail = async (id: string) => {
    try {
      await deleteEmail(id)
      showDeletedToast()
      router.reload()
    } catch (error) {
      showErrorToast('Ocorreu um problema na deleção.')
    }
  }

  const handleSaveEmail = async (email: Email) => {
    try {
      await saveEmail(email.userRole !== Role.ADMIN ? email : { ...email, active: true })
      showSavedToast()
      setIsEditModalOpen(false)
      cleanEmailFields()
      router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema ao salvar.')
    }
  }

  const handleUpdateEmail = async (email: Email) => {
    try {
      await updateEmail(email.userRole !== Role.ADMIN ? email : { ...email, active: true })
      showSavedToast()
      setIsEditModalOpen(false)
      cleanEmailFields()
      router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema ao atualizar email.')
    }
  }

  const handleOpenEdit = (current: Email) => {
    setCurrentEmail(current)
    setPreviousEmail(current)
    setIsEditModalOpen(true)
  }

  const handleOpenSendEmail = (current: Email) => {
    setCurrentEmail(current)
    setIsSendModalOpen(true)
  }

  const onClickDelete = (id: string | undefined, value: string) => {
    setDeleteItem({ id, value })
    setIsDeleteModalOpen(true)
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Papel do Usuário a receber e-mail' },
    { name: 'Assunto' },
    { name: 'Ações' },
  ]

  const onSend = async (form: FormInfo) => {
    try {
      await handleChangePagination(1, form)
    } catch (e) {
      toast.error('Erro ao buscar usuários.')
    }
  }

  const onClean = async () => {
    reset()
    await handleChangePagination(1)
  }

  const rows = emailsList?.map(email =>
    getRowInfo(
      email,
      () => handleOpenSendEmail(email),
      () => handleOpenEdit(email),
      () => onClickDelete(email.id, email.name)
    )
  )

  return (
    <MainWrapper>
      <PageWrapper container rowSpacing={2}>
        <Grid item>
          <Breadcrumbs
            breadcrumbs={[
              { name: 'Listagem de Egressos', href: Routes.GRADUATES },
              { name: 'Gerenciamento', href: Routes.MANAGEMENT },
              { name: 'Informações de Conteúdo de E-mails' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Title>Atualizar Informações de Conteúdo de E-mails</Title>
        </Grid>
        <Grid item xs={12} minHeight={510}>
          <FormContainer formContext={formContext} onSuccess={onSend}>
            <Grid container spacing={3}>
              <Grid item sx={{ width: '350px' }}>
                <FormControl fullWidth>
                  <Select
                    labelId="userRoleToReceiveLabel"
                    variant="standard"
                    name={'userRole'}
                    id={'userRole'}
                    label={'Papel do Usuário a receber e-mail'}
                    options={roles}
                  />
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
            {pagination && (
              <Grid item position="absolute" left="50%" xs={12}>
                <Pagination
                  count={Math.ceil(pagination.total / pageSize)}
                  page={pagination.page + 1}
                  onChange={event => handleChangePagination(event.target as unknown as number)}
                />
              </Grid>
            )}
            <Grid item xs>
              <Grid container columnSpacing={2} justifyContent="right">
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      cleanEmailFields()
                      handleShowEdit()
                    }}
                  >
                    Adicionar Novo Conteúdo
                  </Button>
                </Grid>
                <Grid item justifyContent="center">
                  <Button size={'large'} variant={'outlined'} onClick={handleClickBack}>
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </PageWrapper>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        handleDelete={handleDeleteEmail}
        id={deleteItem.id}
        value={deleteItem.value}
      />
      <EditModal
        handleClose={handleCloseEditModal}
        isShowing={isEditModalOpen}
        currentEmail={currentEmail}
        previousEmail={previousEmail}
        handleUpdate={handleUpdateEmail}
        handleSave={handleSaveEmail}
        setCurrentEmail={setCurrentEmail}
      />
      <SendEmailModal
        handleClose={handleCloseSendModal}
        isShowing={isSendModalOpen}
        role={currentEmail.userRole}
        currentEmail={currentEmail}
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
  const { data, meta } = await getEmails(pageSize, undefined, undefined, apiClient)

  return {
    props: {
      emails: data ?? [],
      meta: meta ?? {},
    },
  }
}

export default EmailConfig
