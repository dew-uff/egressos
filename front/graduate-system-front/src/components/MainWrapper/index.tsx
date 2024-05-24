import { Content, Wrapper } from './index.style'
import React from 'react'
import { Theme } from '@utils/enums'
import MainHeader from '../MainHeader'
import { Metadata } from 'next'

type AppProps = {
  themeName?: Theme
  hasHeader?: boolean
  hasContent?: boolean
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Sistema de Egressos',
  description: 'Sistema para gerenciamento de egressos',
}

const MainWrapper = ({
  themeName = Theme.white,
  hasHeader = true,
  hasContent = true,
  children,
}: AppProps) => {
  return (
    <Wrapper themeName={themeName}>
      {hasHeader && <MainHeader />}
      {hasContent ? <Content>{children}</Content> : children}
    </Wrapper>
  )
}
export default MainWrapper
