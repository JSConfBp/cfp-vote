import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate }) => {
	const css = useStyles();


	return (
		<div className={ css.container }>
			<Typography variant="h4" className={ css.heading }>
            	Set Voting Stage
			</Typography>
			<Typography>
            	Set your voting progress to the next, shortlisting stage
			</Typography>
		</div>
	)
}