import React, { useState } from 'react'

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';

export default ({selectedFields, next}) => {
  const theme = useTheme()
  const [ loading, setLoading ] = useState(false)
  const { showError, showSuccess } = useNotification()

	const importData = () => {
    setLoading(true)

		fetch(`/api/cfp/import/sessionize/fields`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(selectedFields)
		})
    .then(r => r.json())
    .then(result => {
      if (!result.success) {
        throw new Error("Failed")
      }
      showSuccess("Import completed!")
      next()
    })
		.catch(e => {
      showError("Could not import, please check the logs.");
      console.error(e);
    })
    .finally(() => setLoading(false))
	}

  return <>
    {!loading && <>
      <Typography variant="body1" component="div">
        <p>
          Fields to import
        </p>
        <ul>
          {selectedFields.map((item) => <li key={`${item.id}`}>
            { item.field }
          </li>)}
        </ul>
      </Typography>

      <Typography variant="body1" component="div">
        Click the button below, to start the import
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={ {
          marginTop: theme.spacing(4)
        } }
        target="_blank"
        rel="noopener"
        onClick={ importData }
      >
        Start importing
      </Button>
    </>}

    {loading && <>
      <CircularProgress />
    </>}
  </>

}
