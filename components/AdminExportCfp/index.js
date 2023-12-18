import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';

const mime = {
  csv: 'text/csv;charset=utf-8;',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
}

const saveFile = (data, ext, mimeType) => {
  const fileName = `cfp_export.${ext}`

  let blob

  if (ext === 'xlsx') {
    blob = data
  } else {
    blob = new Blob([data], {
      type: mimeType
    });
  }


  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export default ({ onUpdate }) => {
  const theme = useTheme()
  const { showError } = useNotification()
  const [loading, setLoading] = useState(false)

  const download = async (type) => {
    setLoading(true)

    try {
      const response = await fetch('/api/export', {
        method: 'get',
        headers: {
          'Accept': mime[type]
        }
      })

      if (response.status >= 400) throw new Error('Could not fetch')

      if (type === 'xlsx') {
        const data = await response.blob()
        saveFile(data, type, mime[type])
      } else if (type === 'csv') {
        const data = await response.text()
        saveFile(data, type, mime[type])
      } else {
        const data = await response.json()
        saveFile(data, 'json', 'application/json')
      }
    } catch (e) {
      showError('Sorry, could not download the CFP export')
      console.error(e)
    }

    setLoading(false)
  }

	return (<Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h4" sx={{
        marginBottom: theme.spacing(3),
      }}>
      Export Results
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography>
        Download the CFP data with the voting results
      </Typography>
    </Grid>

    <Grid item xs={12}>
      <ButtonGroup
        color="secondary"
        aria-label="full-width contained primary button group"
        disabled={ loading }
      >
        <Button
          onClick={ () => download('csv') }
        > Download CSV</Button>
        <Button
          onClick={ () => download('xlsx') }
        >Download XLSX</Button>
      </ButtonGroup>
    </Grid>
  </Grid>
	)
}
