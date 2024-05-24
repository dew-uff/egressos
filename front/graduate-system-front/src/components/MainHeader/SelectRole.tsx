import React from 'react'
import { useAuth } from '@context/AuthProvider'
import { Role, RoleTranslation } from '@utils/enums'
import { SelectMui, FormControl, MenuItem, InputLabel } from '@components'

const SelectRole = () => {
  const { user, currentRole, updateCurrentRole } = useAuth()
  return (
    <FormControl>
      <InputLabel variant="outlined" id="currentRoleLabel">
        Papel do Usuário
      </InputLabel>
      <SelectMui
        sx={{ minWidth: '120px' }}
        labelId={'currentRoleLabel'}
        id={'currentRole'}
        name={'currentRole'}
        label={'Papel do Usuário'}
        value={currentRole || ''}
        onChange={async event => {
          if (event.target.value) {
            const role = Role[event.target.value as keyof typeof Role]
            updateCurrentRole(role)
          }
        }}
      >
        {user?.roles.map((role, index) => (
          <MenuItem key={index} value={role}>
            {RoleTranslation[role]}
          </MenuItem>
        ))}
      </SelectMui>
    </FormControl>
  )
}

export default SelectRole
