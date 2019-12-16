import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useNotification } from 'notification-hook'

const useStyles = makeStyles(theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
}))


export default ({ authUrl, onAuthenticated }) => {
  const css = useStyles()
  const { showError } = useNotification()
  const [ showCodeField, setShowCodeField ] = useState(false)
  const [ code, setCode ] = useState('')

  const upload = () => {
		fetch(`/api/cfp/import/code`, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain',
				'Accept': 'application/json',
			},
			body: code
		})
    .then(r => r.json())
    .then((resp) => {
      console.log(resp)

      return resp
    })
		.then((resp) => onAuthenticated(resp))
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
				className={ css.button }
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
        className={ css.textField }
				margin="normal"
				fullWidth={ true }
				onChange={ e => setCode(e.target.value) }
      />

			<Button
				variant="contained"
				color="primary"
				className={ css.button }
				onClick={ upload }
			>
				Next
			</Button>
		</>)}
  </>)
}

