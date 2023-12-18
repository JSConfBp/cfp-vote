import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';


export default ({sheetData, selectedFields, next}) => {
  const [ loading, setLoading ] = useState(false)
  const { showError, showSuccess } = useNotification()

	const importData = () => {
    setLoading(true)

		fetch(`/api/cfp/import/fields`, {
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
          SpreadSheet title: <a href={sheetData.spreadSheetUrl}>
            { sheetData.spreadSheetTitle }
          </a>
          <br />
          Sheet name: { sheetData.sheetTitle }
          <br />
          Fields to import
        </p>
        <ul>
          {selectedFields.map((field, id) => <li key={`${id}`}>
            { sheetData.fields[field] }
          </li>)}
        </ul>
      </Typography>

      <Typography variant="body1" component="div">
        Click the button below, to start the import
      </Typography>

      <Button
        variant="contained"
        color="primary"
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
