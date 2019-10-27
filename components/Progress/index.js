
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ name, stats }) => {
	const css = useStyles()

	if (stats.length < 1) {
		return (<div className={css.progress}></div>)
	}

	console.log(name, stats);
	
	const { total, count } = stats.find(stat => (stat.user === name))

	const percent = Math.round(100 * ( count / total))

	return (<div className={css.progress}>
		<CircularProgress
			size="128"
			className={css.circle} variant="static" value={percent} />
		<CircularProgress
			size="128"
			className={css.shadow} variant="static" value={100} />
		<span className={css.percent}>
			{percent}% <br />
			{count} / {total}
		</span>
		<strong className={css.name}>{name}</strong>
	</div>)
}