import React from 'react'
import Authenticated from '../../components/Auth'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import GithubLogin from '../../components/GithubLogin'
import VoteUIConfig from '../../cfp.config'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	paper: theme.mixins.gutters({
		width: '80vw',
		paddingTop: 16,
		paddingBottom: 16,
		margin: '0 auto',
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	}),
	title: {
		marginBottom: theme.spacing(3),
	}
}))

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