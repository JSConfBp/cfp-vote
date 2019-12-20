import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import { useNotification } from 'notification-hook'

const useStyles = makeStyles(theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
	sheetsText: {
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
	field: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	},
	button: {
		marginTop: 2 * theme.spacing.unit,
	}
}))

export default ({ next }) => {
  const css = useStyles()
  const { showError } = useNotification()
  const [ sheets, setSheets ] = useState([])
  const [ spreadSheetId, setSpreadSheetId ] = useState()
  const [ sheetId, setSheetId ] = useState()

	const upload = () => {
		fetch(`/api/cfp/import/sheet`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				spreadSheetId,
				sheetId
			})
		})
		.then(r => r.json())
		.then((resp) => {
			// need to pick the exact sheet within the SpreadSheet
			if (resp.needSheet) {
        setSheets(resp.sheets)
        setSheetId(resp.sheets[0].sheetId)
				return
      }

      const {
        spreadSheetTitle,
        spreadSheetUrl,
        sheetTitle,
        fields,
      } = resp

			next({
        spreadSheetId,
				sheetId,
        spreadSheetTitle,
        spreadSheetUrl,
        sheetTitle,
        fields,
      })
		})
		.catch(e => {
      console.error(e)
			showError("Could not select Sheet, try again later");
		})
	}

  return (<>
    <Typography variant="body1" component="div">
      Enter the spreadsheet ID of the document you wish to import

      https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=0
    </Typography>

    <TextField
      id="standard-multiline-static"
      label="Spreadsheet ID"
      className={ css.field }
      margin="normal"
      fullWidth={ true }
      onChange={ e => setSpreadSheetId(e.target.value) }
    />

    {(sheets.length > 1) && (<>
      <Typography variant="body1" component="div" className={ css.sheetsText}>
        This SpreadSheet has more Sheets than one. Please pick one to import.
      </Typography>
      <FormControl className={css.field}>
        <InputLabel htmlFor="sheet-helper">Select Sheet</InputLabel>
          <NativeSelect
            value={sheets.filter(sheet => (sheet.sheetId === sheetId)).title}
            onChange={e => setSheetId(e.target.value)}
            input={<Input name="sheet" id="sheet-helper" />}
          >
          {sheets.map(({ sheetId, title }) => (
            <option value={sheetId} key={sheetId}>{title}</option>
          ))}
          </NativeSelect>
      </FormControl>
    </>)}

    <Button
      variant="contained"
      color="primary"
      className={ css.nextButton }
      onClick={ upload }
    >
      Next
    </Button>
  </>)
}
