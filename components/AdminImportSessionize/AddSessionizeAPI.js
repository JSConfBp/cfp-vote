import React, { useState } from 'react'

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';

export default ({ next }) => {

  const theme = useTheme()
  const [ url, setData ] = useState('')
  const { showError } = useNotification()

	const upload = () => {
		fetch(`/api/cfp/import/sessionize/activate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({ url }),
    })
    .then(resp => {
      if (resp.statusCode >= 400) {
        throw resp
      }
      return resp.json()
    })
    .then(({
      fields
    }) => {
      next(fields)
    })
    .catch(e => {
      showError("There was an error reading the Sessionize API. Check the logs, and try again.");
      console.error(e);
    })
	}


  return (<>
    <Typography variant="body1" component="div">
      <ul>
        <li>
          Go to <strong>API / Embed</strong> on the Sessionize Dashboard.
        </li>
        <li>
          Click <strong>Create new Endpoint</strong>
        </li>
        <li>
          Set Format to JSON, include all sessions
        </li>
        <li>
          Select fields you wish to appear as import fields, but at least the title and description
        </li>
        <li>
          Save changes, then click <strong>Get Code</strong>, pick the API URL from the All Data field.
        </li>
        <li>
          Paste the API URL in the field below.
        </li>
      </ul>
    </Typography>

    <TextField
      id="standard-multiline-static"
      label="https://sessionize.com/api/v2/_______/view/All"
      sx={ {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: 4 * theme.spacing.unit,
        width: 400,
      } }
      margin="normal"
      fullWidth={ true }
      onChange={ e => setData(e.target.value) }
    />

    <Button
      variant={'contained'}
      color="primary"
      sx={{
        marginTop: theme.spacing(4)
      }}
      onClick={e => upload()}
    >
      Next
    </Button>
  </>)
}
