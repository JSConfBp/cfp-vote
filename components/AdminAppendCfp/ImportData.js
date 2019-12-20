import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useNotification } from 'notification-hook'

const useStyles = makeStyles(theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
}))

export default ({sheetData, selectedFields, next}) => {
  const css = useStyles();
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
        className={ css.button }
        target="_blank"
        rel="noopener"
        onClick={ importData }
      >
        Start importing
      </Button>
    </>}

    {loading && <>
      <CircularProgress className={ css.progress } />
    </>}
  </>

}
