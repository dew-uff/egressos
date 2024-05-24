import React, { useState } from 'react'
import { Routes, USER_TOKEN_NAME } from '@utils/enums'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import {
  ActionIcon,
  Button,
  MainWrapper,
  showDeletedToast,
  showSavedToast,
  Grid,
  showEditedToast,
  showErrorToast,
  DeleteItem,
  DeleteModal,
  Breadcrumbs,
  CustomTable,
  EditRoundedIcon,
  DeleteForeverRoundedIcon,
  FormControl,
  InputMui as TextField,
} from '@components'
import { parseCookies } from 'nookies'
import { deleteCnpqLevel, getCNPQLevels, saveCNPQ, updateCNPQ } from '@modules/CNPQLevels/api'
import { CNPQLevelInfo } from '@modules/WorkHistoryEdit'
import { getAPIClient } from '@services/axios'

interface Props {
  cnpqLevels: CNPQLevelInfo[]
}

const Levels: React.FC = ({ cnpqLevels }: Props) => {
  const apiClient = getAPIClient()
  const [currentLevel, setCurrentLevel] = useState<{
    id: null | string
    value: string
  }>({ id: null, value: '' })
  const [show, setShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>({ id: undefined, value: undefined })

  const router = useRouter()

  const { id, value } = currentLevel

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const onClickDelete = (id: string | undefined, value: string) => {
    setDeleteItem({ id, value })
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCnpqLevel = async (id: string) => {
    try {
      await deleteCnpqLevel(apiClient, id)
      showDeletedToast()
      await router.replace(router.asPath)
    } catch (e) {
      showErrorToast('Erro ao buscar tipos de bolsa CNPQ')
    }
  }

  const handleSaveCNPQ = async () => {
    try {
      await saveCNPQ(apiClient, value)
      showSavedToast()
      setShow(false)
      setCurrentLevel({ id: null, value: '' })
      await router.replace(router.asPath)
    } catch (e) {
      showErrorToast('Não foi possível salvar o nível CNPQ')
    }
  }

  const handleUpdateCNPQ = async () => {
    if (id) {
      try {
        await updateCNPQ(apiClient, id, value)
        showEditedToast()
        setShow(false)
        setCurrentLevel({ id: null, value: '' })
        await router.replace(router.asPath)
      } catch (e) {
        showErrorToast('Não foi possível atualizar o nível CNPQ')
      }
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrentLevel({ id, value })
  }

  const columns = [
    {
      name: 'Nível CNPQ',
    },
    {
      name: 'Ações',
      width: '20%',
    },
  ]

  const rows = cnpqLevels?.map(({ id, name }) => [
    { body: name },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(id, name)}>
            <EditRoundedIcon />
          </ActionIcon>
          <ActionIcon onClick={() => onClickDelete(id, name)}>
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        </section>
      ),
    },
  ])

  return (
    <MainWrapper>
      <PageWrapper container rowSpacing={2}>
        <Grid item>
          <Breadcrumbs
            breadcrumbs={[
              { name: 'Listagem de Egressos', href: Routes.GRADUATES },
              { name: 'Gerenciamento', href: Routes.MANAGEMENT },
              { name: 'Níveis CNPQ' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Title>Atualizar Níveis CNPQ</Title>
        </Grid>
        <Grid item xs={12}>
          {cnpqLevels.length ? (
            <CustomTable columns={columns} rows={rows} />
          ) : (
            <Fields>Nenhum resultado encontrado.</Fields>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container columnSpacing={2} justifyContent="right">
            <Grid item>
              <Button
                size={'large'}
                variant={'contained'}
                onClick={() => {
                  setCurrentLevel({ id: null, value: '' })
                  handleShow()
                }}
              >
                Adicionar Nível
              </Button>
            </Grid>
            <Grid item>
              <Button size={'large'} variant={'outlined'} onClick={onClickBack}>
                Voltar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </PageWrapper>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        handleDelete={handleDeleteCnpqLevel}
        id={deleteItem.id}
        value={deleteItem.value}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{id ? 'Editar' : 'Adicionar'} Nível CNPQ</Fields>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            <TextField
              value={value}
              required
              name={'cnpqLevel'}
              label={'Nível CNPQ'}
              onChange={({ target }) => setCurrentLevel({ ...currentLevel, value: target.value })}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={id ? handleUpdateCNPQ : handleSaveCNPQ}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
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
  try {
    const levels = await getCNPQLevels(apiClient)
    return {
      props: {
        cnpqLevels: levels ?? [],
      },
    }
  } catch (e) {
    return {
      props: {
        cnpqLevels: [],
      },
    }
  }
}

export default Levels
