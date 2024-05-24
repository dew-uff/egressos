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
  CustomTable,
  DeleteItem,
  DeleteModal,
  Breadcrumbs,
  showErrorToast,
  EditRoundedIcon,
  DeleteForeverRoundedIcon,
  Grid,
  FormControl,
  InputMui,
} from '@components'

import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'
import {
  deleteInstitutionType,
  getInstitutionTypes,
  saveInstitutionType,
  updateInstitutionType,
} from '@modules/InstitutionTypes/api'
import { InstitutionType } from '@modules/InstitutionTypes/types'

interface Props {
  institutionTypes: InstitutionType[]
}

const Institutions = ({ institutionTypes }: Props) => {
  const apiClient = getAPIClient()
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionType>({
    name: '',
  })
  const [show, setShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>({ id: undefined, value: undefined })

  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const handleDeleteInstitutionType = async (id: string) => {
    try {
      await deleteInstitutionType(apiClient, id)
      await router.replace(router.asPath)
      showDeletedToast()
    } catch (error) {
      showErrorToast('Ocorreu um erro ao deletar tipo de instituição.')
    }
  }

  const handleSaveInstitution = async (institutionType: InstitutionType) => {
    try {
      await saveInstitutionType(apiClient, institutionType)
      await router.replace(router.asPath)
      showSavedToast()
      setShow(false)
      setCurrentInstitution({ id: undefined, name: '' })
    } catch (error) {
      showErrorToast('Ocorreu um erro ao salvar tipo de instituição.')
    }
  }

  const handleUpdateInstitution = async (institutionType: InstitutionType) => {
    try {
      await updateInstitutionType(apiClient, institutionType)
      await router.replace(router.asPath)
      showSavedToast()
      setShow(false)
      setCurrentInstitution({ id: undefined, name: '' })
    } catch (error) {
      showErrorToast('Ocorreu um erro ao atualizar tipo de instituição.')
    }
  }

  const handlerOpenEdit = (id: string, name: string) => {
    setShow(true)
    setCurrentInstitution({ id, name })
  }

  const columns = [
    {
      name: 'Tipo de Instituição',
    },
    {
      name: 'Ações',
      width: '20%',
    },
  ]

  const onClickDelete = (id: string | undefined, value: string) => {
    setDeleteItem({ id, value })
    setIsDeleteModalOpen(true)
  }

  const rows = institutionTypes?.map(({ id, name }) => [
    { body: name },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(id as string, name)}>
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
              { name: 'Tipos de Instituição' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Title>Atualizar Tipo de Instituição</Title>
        </Grid>
        <Grid item xs={12}>
          {rows?.length !== 0 ? (
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
                  setCurrentInstitution({ id: undefined, name: '' })
                  handleShow()
                }}
              >
                Adicionar Tipo de Instituição
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
        handleDelete={handleDeleteInstitutionType}
        id={deleteItem.id}
        value={deleteItem.value}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{currentInstitution.id ? 'Editar' : 'Adicionar'} Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            <InputMui
              value={currentInstitution.name}
              required
              name={'institution'}
              label={'Instituição'}
              onChange={({ target }) =>
                setCurrentInstitution({ ...currentInstitution, name: target.value })
              }
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={'large'}
            variant={'contained'}
            onClick={() =>
              currentInstitution.id
                ? handleUpdateInstitution(currentInstitution)
                : handleSaveInstitution(currentInstitution)
            }
          >
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
  const types = await getInstitutionTypes(apiClient)

  return {
    props: {
      institutionTypes: types ?? [],
    },
  }
}

export default Institutions
