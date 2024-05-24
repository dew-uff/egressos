export enum Theme {
  gray = 'gray',
  white = 'white',
}

export const USER_TOKEN_NAME = 'user.token'

export enum Role {
  ADMIN = 'ADMIN',
  GRADUATE = 'GRADUATE',
  PROFESSOR = 'PROFESSOR',
}

export const RoleTranslation = {
  null: 'Nenhum selecionado',
  [Role.PROFESSOR]: 'Orientador',
  [Role.ADMIN]: 'Administrador',
  [Role.GRADUATE]: 'Egresso',
  multiple: 'Múltiplos',
}

export enum Routes {
  LOGIN = '/',
  GRADUATES = '/egressos',
  GRADUATE = '/egressos/[id]',
  MANAGEMENT = '/gerenciamento',
  MANAGEMENT_EMAILS = '/gerenciamento/emails/templates',
  MANAGEMENT_INSTITUTIONS = '/gerenciamento/instituicoes',
  MANAGEMENT_INSTITUTIONS_TYPES = '/gerenciamento/tipos-de-instituicao',
  MANAGEMENT_USERS = '/gerenciamento/usuarios',
  MANAGEMENT_USER = '/gerenciamento/usuarios/[id]',
  MANAGEMENT_NEW_USER = '/gerenciamento/usuarios/novo',
  MANAGEMENT_CNPQ_LEVELS = '/gerenciamento/niveis-cnpq',
  MANAGEMENT_CI_PROGRAMS = '/gerenciamento/programas-ic',
  RESET_PASSWORD = '/alterar-senha/[code]',
}
