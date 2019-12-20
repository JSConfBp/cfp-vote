import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useNotification } from 'notification-hook'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ next }) => {
  const css = useStyles();
  const [ data, setData ] = useState('')
  const { showError } = useNotification()

	const upload = () => {
		fetch(`/api/cfp/import/activate`, {
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
      className={ css.textField }
      margin="normal"
      fullWidth={ true }
      onChange={ e => setData(e.target.value) }
    />

    <Button
      variant={'contained'}
      color="primary"
      className={ css.nextButton }
      onClick={e => upload()}
    >
      Next
    </Button>
  </>)
}
