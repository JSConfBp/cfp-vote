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
