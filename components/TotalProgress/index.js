
import React from 'react'

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { deepPurple } from '@mui/material/colors';

export default ({ stats }) => {

	if (stats.length < 1) {
		return (<div sx={{
      width: 128,
      height: 160,
      margin: '0 auto',
      marginBottom: 32,
      marginTop: 16,
      position: 'relative'
    }}></div>)
	}

	const userCount = stats.length
	const total = stats[0].total
	const sum = stats.reduce((sum, stat) => (sum + stat.count), 0)
	const percent = Math.round(100 * (sum / (userCount * total)))

	return (<Box sx={{
		width: 128,
		height: 160,
		margin: '0 auto',
		marginBottom: 2,
		marginTop: 1,
		position: 'relative'
	}}>
		<CircularProgress
			size="128"
			sx={{
        top: 0,
        width: 128,
        height: 128,
        color: deepPurple[500],
        zIndex: 2,
        position: 'absolute'
      }} variant="determinate" value={percent} />
		<CircularProgress
			size="128"
			sx={{
        top: 0,
        width: 128,
        height: 128,
        color: deepPurple[100],
        zIndex: 1,
      }} variant="determinate" value={100} />

		<Typography sx={{
		zIndex: 3,
		position: 'absolute',
		left: 0,
		width: 128,
		textAlign: 'center',
		top: 54,
	}}>
			{percent}%
		</Typography>
		<Typography sx={ {
		display: 'block',
		textAlign: 'center',
    fontWeight: 'bold'
	}}>
			Total progress
		</Typography>
	</Box>)
}
