import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

import styles from './styles'
const useStyles = makeStyles(styles)

const mime = {
  csv: 'text/csv;charset=utf-8;',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
}
export default ({ onUpdate }) => {
  const css = useStyles();
  const [loading, setLoading] = useState(false)

  const download = async (type) => {
    setLoading(true)
    console.log('download', type);

    const response = await fetch('/api/export', {
      method: 'get',
      headers: {
        'Accept': mime[type]
      }
    })

    const data = await response.text()

    console.log(data);
    setLoading(false)

  }

	return (<Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h4" className={ css.heading }>
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
        >Download CSV</Button>
        <Button
          onClick={ () => download('xlsx') }
        >Download XLSX</Button>
      </ButtonGroup>
    </Grid>
  </Grid>
	)
}
