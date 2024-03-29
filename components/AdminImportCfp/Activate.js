import React, { useState } from 'react'

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';

export default ({ next }) => {
  const theme = useTheme()
  const [ data, setData ] = useState('')
  const { showError } = useNotification()

	const upload = () => {
		fetch(`/api/gsheet/activate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: data
    })
    .then(resp => {
      if (resp.statusCode >= 400) {
        throw resp
      }
      return resp.json()
    })
    .then((resp) => {
      next(resp)
    })
    .catch(e => {
      showError("Could not upload JSON, please check the contents and try again.");
      console.error(e);
    })
	}


  return (<>
    <Typography variant="body1" component="div">
      <ul>
        <li>
          Visit the <a href="https://developers.google.com/sheets/api/quickstart/nodejs" target="_blank" rel="noopener">Sheets API
          Guide</a>.
        </li>
        <li>
          Click the <strong>"Enable the Google Sheets API"</strong> button.
        </li>
        <li>
          In the overlay that opens, click the <strong>"Download client configuration"</strong>
          and download a JSON file.
        </li>
        <li>
          Copy the contents of that JSON here.
        </li>
      </ul>
    </Typography>

    <TextField
      id="standard-multiline-static"
      label="credentials.json"
      multiline
      rows="6"
      sx={{
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: 4 * theme.spacing.unit,
        width: 400,
      }}
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
