
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ stats }) => {
	const css = useStyles()

	if (stats.length < 1) {
		return (<div className={css.progress}></div>)
	}

	const userCount = stats.length
	const total = stats[0].total
	const sum = stats.reduce((sum, stat) => (sum + stat.count), 0)
	const percent = Math.round(100 * (sum / (userCount * total)))

	return (<div className={css.progress}>
		<CircularProgress
			size="128"
			className={css.circle} variant="static" value={percent} />
		<CircularProgress
			size="128"
			className={css.shadow} variant="static" value={100} />

		<span className={css.percent}>
			{percent}%
		</span>
		<strong className={css.name}>
			Total progress
		</strong>
	</div>)
}
