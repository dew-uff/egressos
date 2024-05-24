import React, { useState } from 'react'
import { Routes, USER_TOKEN_NAME } from '@utils/enums'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import {
  ActionIcon,
  Button,
  Input,
  MainWrapper,
  Select,
  SelectMui,
  showDeletedToast,
  showSavedToast,
  EditRoundedIcon,
  DeleteForeverRoundedIcon,
  showErrorToast,
  CustomTable,
  DeleteItem,
  DeleteModal,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  InputMui as TextField,
  SearchRoundedIcon,
  ClearRoundedIcon,
  Breadcrumbs,
  FormContainer,
} from '@components'

import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'
import {
  createInstitution,
  deleteInstitution,
  getInstitutions,
  updateInstitution,
} from '@modules/Institutions/api'
import {
  CreateInstitution,
  Institution,
  InstitutionFilters,
  InstitutionsDTO,
} from '@modules/Institutions/types'
import { DEFAULT_PAGE_SIZE, PaginationType } from '@modules/Commons/types'
import { useForm } from 'react-hook-form'
import { getInstitutionTypesOptions } from '@modules/Commons/api'
import { SelectItem } from '@utils/types'

interface Props {
  institutions: Institution[]
  meta: PaginationType
  institutionTypes: SelectItem[]
}

const Institutions = ({ institutions, meta, institutionTypes }: Props) => {
  const apiClient = getAPIClient()
  const [currentInstitution, setCurrentInstitution] = useState<CreateInstitution>({
    name: '',
    typeId: '',
  })
  const [institutionsList, setInstitutionsList] = useState<Institution[]>(institutions)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [show, setShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>({ id: undefined, value: undefined })

  const formContext = useForm()
  const { getValues, reset } = formContext

  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const handleGetInstitutions = async (filters: InstitutionFilters, page: number) => {
    try {
      const { data: institutionsPagination, meta: metaPagination } = await getInstitutions(
        apiClient,
        page,
        DEFAULT_PAGE_SIZE,
        filters
      )
      setInstitutionsList(institutionsPagination)
      setPagination(metaPagination)
    } catch (e) {
      showErrorToast('Erro ao buscar instituições.')
    }
  }

  const handleDeleteInstitution = async (id: string) => {
    try {
      await deleteInstitution(apiClient, id)
      await handleGetInstitutions({} as InstitutionFilters, 1)
      showDeletedToast()
    } catch (error) {
      showErrorToast('Ocorreu um erro ao deletar instituição.')
    }
  }

  const onCloseModal = () => {
    setShow(false)
    setCurrentInstitution({ id: undefined, name: '', typeId: '' })
  }

  const handleSaveInstitution = async (createInstitutionDTO: CreateInstitution) => {
    try {
      await createInstitution(apiClient, createInstitutionDTO)
      await handleGetInstitutions({} as InstitutionFilters, 1)
      showSavedToast()
      onCloseModal()
    } catch (error) {
      showErrorToast('Ocorreu um erro ao criar instituição.')
    }
  }

  const handleUpdateInstitution = async (institutionDTO: CreateInstitution) => {
    try {
      await updateInstitution(apiClient, institutionDTO)
      await handleGetInstitutions({} as InstitutionFilters, 1)
      showSavedToast()
      onCloseModal()
    } catch (error) {
      showErrorToast('Ocorreu um erro ao atualizar instituição.')
    }
  }

  const onSend = async (data: InstitutionFilters) => handleGetInstitutions(data, 1)

  const onChangePagination = async (event: any, value: number) => {
    const filters = getValues() as InstitutionFilters
    await handleGetInstitutions(filters, value)
  }

  const onClean = async () => {
    reset()
    await handleGetInstitutions({} as InstitutionFilters, 1)
  }

  const handlerOpenEdit = (id: string, name: string, type: string) => {
    setShow(true)
    setCurrentInstitution({ id, name, typeId: type })
  }

  const columns = [
    {
      name: 'Nome',
    },
    {
      name: 'Tipo de Instituição',
    },
    {
      name: 'Ações',
      width: '20%',
    },
  ]

  const onDelete = (id: string, value: string) => {
    setDeleteItem({ id, value })
    setIsDeleteModalOpen(true)
  }

  const rows = institutionsList?.map(({ id, name, type }) => [
    { body: name },
    { body: type.name },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(id as string, name, type.id as string)}>
            <EditRoundedIcon />
          </ActionIcon>
          <ActionIcon onClick={() => onDelete(id as string, name)}>
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
              { name: 'Instituições' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Title>Atualizar Instituições</Title>
        </Grid>
        <Grid item sx={{ paddingBottom: '20px' }}>
          <FormContainer formContext={formContext} onSuccess={onSend}>
            <Grid container spacing={2}>
              <Grid
                item
                sx={{
                  width: '350px',
                }}
              >
                <FormControl fullWidth>
                  <Input variant="standard" label="Nome da instituição" name="name" />
                </FormControl>
              </Grid>
              <Grid
                item
                sx={{
                  width: '350px',
                }}
              >
                <FormControl fullWidth>
                  <Select
                    variant="standard"
                    name={'type'}
                    label={'Tipo da instituição'}
                    options={institutionTypes}
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
            </Grid>
          </FormContainer>
        </Grid>
        <Grid item xs={12}>
          {institutionsList.length ? (
            <CustomTable columns={columns} rows={rows} />
          ) : (
            <Fields>Nenhum resultado encontrado.</Fields>
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="right">
            {pagination && institutionsList.length > 0 && (
              <Grid item position="absolute" left="50%">
                <Pagination
                  count={Math.ceil(pagination.total / DEFAULT_PAGE_SIZE)}
                  page={pagination.page + 1}
                  onChange={onChangePagination}
                />
              </Grid>
            )}
            <Grid item>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      setCurrentInstitution({ id: undefined, name: '', typeId: '' })
                      handleShow()
                    }}
                  >
                    Adicionar Instituição
                  </Button>
                </Grid>
                <Grid item justifyContent="center">
                  <Button size={'large'} variant={'outlined'} onClick={onClickBack}>
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
        handleDelete={handleDeleteInstitution}
        id={deleteItem.id}
        value={deleteItem.value}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{currentInstitution.id ? 'Editar' : 'Adicionar'} Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentInstitution.name}
                  required
                  name={'name'}
                  label={'Nome'}
                  onChange={({ target }) =>
                    setCurrentInstitution({ ...currentInstitution, name: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="type">Tipo de instituição*</InputLabel>
                <SelectMui
                  name={'type'}
                  labelId="type"
                  value={currentInstitution.typeId}
                  label={'Tipo de instituição*'}
                  onChange={({ target }) => {
                    const type = target.value as string
                    setCurrentInstitution({ ...currentInstitution, typeId: type })
                  }}
                >
                  {institutionTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.label}
                    </MenuItem>
                  ))}
                </SelectMui>
              </FormControl>
            </Grid>
          </Grid>
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

  const promises = [getInstitutions(apiClient), getInstitutionTypesOptions(apiClient)]

  const [institutionsResponse, institutionTypesResponse] = await Promise.all(promises)

  const { data, meta } = institutionsResponse as InstitutionsDTO

  return {
    props: {
      institutions: data ?? [],
      meta,
      institutionTypes: institutionTypesResponse ?? [],
    },
  }
}

export default Institutions
