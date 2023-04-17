import styled from 'styled-components'
import { Theme } from '../../utils/enums'

const theme = {
  gray: {
    backgroundColor: '#F8F3FF',
  },
  white: {
    backgroundColor: '#FFF',
  },
}

type AppProps = {
  themeName: Theme
}

export const Wrapper = styled.div<AppProps>`
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${props => theme[props.themeName].backgroundColor};

  //@media screen and (min-width: 320px) and {
  //  position: absolute;
  //  top: 100%;
  //  left: 0;
  //  width: 100vh;
  //  height: 100vw;
  //  overflow: hidden;
  //  transform: rotate(-90deg);
  //  transform-origin: left top;
  //}
`

export const Content = styled.div`
  //width: 100%;
  flex-direction: column;
  height: 100%;
  padding: 0 70px 0 50px;

  //@media (min-width: 360px) {
  //  width: 328px;
  //  margin: 0 auto;
  //  padding: 0;
  //}
`
