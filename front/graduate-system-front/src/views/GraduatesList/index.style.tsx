import styled from 'styled-components'
const statusColor = {
  PENDING: '#e11818',
  UPDATED: '#5BAFC9',
  UPDATED_PARTIALlY: '#DCB552',
  UNKNOWN: '#808080D3',
}

export const Background = styled.div`
  background: #ffffffff;
  opacity: 0.99;
  height: 100%;
  width: 100%;
`

export const Content = styled.div`
  width: 90%;
  padding: 20px 50px 50px 50px;
  flex-direction: column;
  display: block;
  margin: 0 auto;
`

export const Title = styled.h1`
  padding-top: 24px;
  padding-bottom: 26px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: #0b6951b2;
`

export const Subtitle = styled.h1`
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 140px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 47px;

  color: #0b6951b2;
`

export const Icon = styled.button`
  font-size: 18px;
  line-height: 24px;
  cursor: pointer;
  color: #00000066;
  border: none;
  background: transparent;
`

export const Fields = styled.h1`
  padding-top: 5px;
  padding-bottom: 10px;
  padding-right: 140px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;

  color: ${({ status }: { status?: string }) => (status ? statusColor[status] : '#0B6951B2')};
`
