
import React from 'react'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { deepPurple } from '@mui/material/colors';
import { useTheme } from '@emotion/react';

export default ({ name, stats }) => {
	const theme = useTheme()

	if (stats.length < 1) {
		return (<div sx={{
      width: 128,
      height: 160,
      margin: '0 2rem',
      marginBottom: 32,
      marginTop: 16,
      position: 'relative',
      display: 'inline-block'
    }}></div>)
	}

	const { total, count } = stats.find(stat => (stat.user === name))

	const percent = Math.round(100 * ( count / total))

	return (<Box sx={{
		width: 128,
		height: 160,
		marginInline: 2,
		marginBottom: 2,
		marginTop: 1,
		position: 'relative',
    display: 'inline-block'
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
      top: 44,
    }}>
			{percent}% <br />
			{count} / {total}
		</Typography>
		<Typography sx={{
      display: 'block',
      textAlign: 'center',
      fontWeight: 'bold'
	  }}>{name}</Typography>
	</Box>)
}
