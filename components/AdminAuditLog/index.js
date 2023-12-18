import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useNotification } from '../NotificationHook'
import { useTheme } from '@emotion/react';

export default ({ onUpdate, onError }) => {
	const theme = useTheme()

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
				<Typography variant="h4" sx={{
          marginBottom: theme.spacing(3),
        }}>
					Audit Log
				</Typography>
			</Grid>
      <Grid item xs={12}>
        <Paper sx={{
      display: 'block',
      padding: theme.spacing(1),
    }}>
          <Table size="small" aria-label="a dense table">
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
