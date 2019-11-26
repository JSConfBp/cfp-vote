import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate }) => {
	const css = useStyles();


	return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" className={ css.heading }>
          Import CFPs from Google Sheets
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography>
          Import CFP submissions directly from Google Sheets.
        </Typography>
        </Grid>
        <Grid item xs={12}>
        <Typography>
          This is probably the most GDPR compliant way to handle CFP submissions,
          as we won't process any other field from Google Sheets,
          just those you select to appear in the voting.  
        </Typography>
      </Grid>
    </Grid>
	)
}
