import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';

export default ({ authUrl, next }) => {
  const theme = useTheme()
  const { showError } = useNotification()
  const [ showCodeField, setShowCodeField ] = useState(false)
  const [ code, setCode ] = useState('')

  const upload = () => {
		fetch(`/api/gsheet/code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
				'Accept': 'application/json',
			},
			body: code
		})
    .then(r => r.json())
    .then((resp) => {

      return resp
    })
		.then((resp) => next(resp))
		.catch(e => {
      console.error(e)
      showError("Authentication failed, try again later");
		})
  }

  const openAuth = () => {
    window.open(
      authUrl,
      "GoogleAuth",
      "width=480,height=620,resizable,scrollbars,status"
    );

    setShowCodeField(true)
  }

  return (<>
		{!showCodeField && (<>
			<Typography variant="body1" component="div">
				Click the button below, to authenticate your user with Google Drive, and provide access for the spreadsheets.
			</Typography>

			<Button
				variant="contained"
				color="primary"
				onClick={ () => openAuth() }
			>
				Authenticate
			</Button>
    </>)}
    {showCodeField && (<>
			<Typography variant="body1" component="div">
				Enter the code you received after the authentication:
			</Typography>

			<TextField
        id="standard-multiline-static"
        label="Verification Code"
        sx={{
          marginLeft: theme.spacing.unit,
          marginRight: theme.spacing.unit,
          marginBottom: 4 * theme.spacing.unit,
          width: 400,
        }}
				margin="normal"
				fullWidth={ true }
				onChange={ e => setCode(e.target.value) }
      />

			<Button
				variant="contained"
				color="primary"
				sx={{
          marginTop: theme.spacing(4)
        }}
				onClick={ () => upload() }
			>
				Next
			</Button>
		</>)}
  </>)
}

