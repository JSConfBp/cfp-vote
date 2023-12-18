import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import { useNotification } from '../NotificationHook'


export default ({ next }) => {
  const theme = useTheme()
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
      sx={{
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginBottom: 4 * theme.spacing.unit,
        width: 400,
      }}
      margin="normal"
      fullWidth={ true }
      onChange={ e => setSpreadSheetId(e.target.value) }
    />

    {(sheets.length > 1) && (<>
      <Typography variant="body1" component="div" sx={{
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	}}>
        This SpreadSheet has more Sheets than one. Please pick one to import.
      </Typography>
      <FormControl sx={{
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		marginBottom: 4 * theme.spacing.unit,
		width: 400,
	}}>
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
      sx={{
        marginTop: theme.spacing(4)
      }}
      onClick={ upload }
    >
      Next
    </Button>
  </>)
}
