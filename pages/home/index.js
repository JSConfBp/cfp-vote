import React from 'react'
import Authenticated from '../../components/Auth'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import GithubLogin from '../../components/GithubLogin'
import VoteUIConfig from '../../cfp.config'

import styles from './styles'

const useStyles = makeStyles(styles)

const Index = () => {

	const css = useStyles();

	return (<div className={css.root}>
		<div className={css.paper}>
			<Typography className={css.title} variant="h2">
				{ VoteUIConfig.title }
			</Typography>
			<Typography component="div">
				<GithubLogin>Login with GitHub</GithubLogin>
			</Typography>

		</div>
	</div>)
}


export default Authenticated(Index)