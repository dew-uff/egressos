import React from 'react'
import { MainWrapper, Grid } from '@components'
import { PageWrapper, Title } from '@styles/index.style'

const NotFoundPage = () => (
  <MainWrapper>
    <PageWrapper
      spacing={2}
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Title>403 - Página não autorizada.</Title>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  </MainWrapper>
)

export default NotFoundPage
