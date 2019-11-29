import React, { useEffect, useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useNotification } from 'notification-hook'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();

	const [ log, setLog ] = useState([])
	const { showError, showSuccess } = useNotification()

  const getLog = async () => {
    try {
      const result = await fetch('/api/auditlog', {
        method: 'get',
      })

      if (result.status >= 400) throw (`Api error: ${result.status}`)

      const data = await result.json()
      setLog(data)
    } catch (e) {
      showError('Could not read audit log.')
    }
  }

  useEffect(() => {
		getLog()
	}, [false])


	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" className={ css.heading }>
					Audit Log
				</Typography>
			</Grid>
      <Grid item xs={12}>
        <Paper className={css.container}>
          <Table className={css.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {log.map(row => (
                <TableRow key={row.timestamp}>
                  <TableCell component="th" scope="row">
                    {row.timestamp}
                  </TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
		</Grid>
	)
}
