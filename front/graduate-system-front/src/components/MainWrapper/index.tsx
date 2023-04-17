import { Wrapper, Content } from './index.style'
import React from 'react'
import { Theme } from '../../utils/enums'
import Head from 'next/head'
import MainHeader from '../MainHeader'

type AppProps = {
  themeName: Theme
  hasHeader?: boolean
  hasContent?: boolean
  children: React.ReactNode
}

const MainWrapper = ({
  themeName,
  hasHeader = true,
  hasContent = true,
  children,
}: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>Sistema de Egressos</title>
      </Head>
      <Wrapper themeName={themeName}>
        {hasHeader && <MainHeader />}
        {hasContent ? <Content>{children}</Content> : children}
      </Wrapper>
    </>
  )
}
export default MainWrapper
