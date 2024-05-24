import styled from 'styled-components'
import { theme } from '@styles/theme'

export const Header = styled.header`
  display: block;
  height: 100px;
  width: 100%;
  border-bottom: 3px solid ${theme.palette.primary.main};
`
export const Cabecalho = styled.div`
  padding-left: 90px;
  padding-right: 50px;
`
export const Title = styled.h1`
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: ${theme.palette.primary.main};
`

export const ProfileIcon = styled.h1`
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 47px;

  color: ${theme.palette.primary.main};
`

export const EditIcon = styled.h1`
  cursor: pointer;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0;
  font-style: normal;
  font-weight: normal;
  color: ${theme.palette.grey['400']};
`

export const Texto = styled.h6`
  color: ${theme.palette.primary.main};
`

export default Header
