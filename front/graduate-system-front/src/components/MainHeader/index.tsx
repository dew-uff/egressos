import Image from 'next/image'
import Link from 'next/link'
import { Header, Title, ProfileIcon } from './index.style'
import logo from '@public/logo-ic-uff-png.png'
import React from 'react'
import { useAuth } from '@context/AuthProvider'
import Router from 'next/router'
import { Role, Routes } from '@utils/enums'
import {
  Button,
  Grid,
  LogoutRoundedIcon as Logout,
  Box,
  Divider,
  KeyboardArrowDownRoundedIcon,
  AccountCircleIcon,
  SettingsIcon,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@components'
import Head from 'next/head'
import { getHomeUrlAccordingRole } from '@utils/functions'
import SelectRole from '@components/MainHeader/SelectRole'

const MainHeader: React.FC = () => {
  const { user, currentRole, logout } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const open = Boolean(anchorEl)

  const onClickConfig = () => {
    Router.push(Routes.MANAGEMENT)
  }

  const userNames = user?.name.split(' ')
  const userFirstAndSecondName = userNames
    ? userNames.length > 1
      ? userNames?.slice(0, 2).join(' ')
      : userNames[0]
    : ''

  const logoLink =
    currentRole && user ? getHomeUrlAccordingRole(currentRole, user.id) : Routes.LOGIN

  return (
    <Grid item minWidth="1000px">
      <Header>
        <Head>
          <title>Sistema Egressos</title>
        </Head>
        <Grid container px={11} alignItems="center" height="100%" width="100%">
          <Box>
            <Link href={logoLink} passHref>
              <Image src={logo} width={108} alt="Logo IC-UFF" />
            </Link>
          </Box>

          <Grid item pl={3} alignSelf="center">
            <Title>Sistema de Egressos</Title>
          </Grid>
          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item pr={1}>
                <SelectRole />
              </Grid>
              <Grid item pl={2}>
                <ProfileIcon>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </ProfileIcon>
              </Grid>
              <Button
                variant="text"
                size="medium"
                sx={{ textTransform: 'none', fontSize: '16px' }}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                onClick={handleClick}
              >
                {userFirstAndSecondName}
              </Button>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {currentRole === Role.ADMIN && (
                  <MenuItem onClick={onClickConfig}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Gerenciamento
                  </MenuItem>
                )}
                {currentRole === Role.ADMIN && <Divider />}
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Header>
    </Grid>
  )
}

export default MainHeader
