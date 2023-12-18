import React from 'react'
import getConfig from 'next/config'
import Button from '@mui/material/Button';
import { useTheme } from '@emotion/react';

const { publicRuntimeConfig: { gh_client_id, gh_redirect_uri, nonce_state, gh_scope} } = getConfig()

const GithubLogin = (props) => {

  const theme = useTheme()

  return <form action="/login">
    <Button variant={'contained'} sx={{
      color: theme.palette.getContrastText('#24292e'),
      backgroundColor: '#24292e',
      '&:hover': {
        backgroundColor: '#24292e',
      },
    }} type="submit">
      {props.children}
    </Button>
  </form>
}

export default GithubLogin
