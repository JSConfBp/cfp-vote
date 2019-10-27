import React, { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import classNames from 'classnames'
import getConfig from 'next/config'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Link from '../../components/Link';
import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar';
import AdminMenu from '../../components/AdminMenu'
import Progress from '../../components/Progress'
import TotalProgress from '../../components/TotalProgress'

import VoteUIConfig from '../../cfp.config'

const { publicRuntimeConfig: { api_url } } = getConfig()

const useStyles = makeStyles(theme => ({
	paper: {
		background: 'none',
	},
	centered: theme.mixins.gutters({
		background: 'none',
		margin: '0 auto',
		width: '80vw',
	}),
	paper_first: {
		paddingTop: 32,
		marginTop: 20,
		marginBottom: 20,
		[theme.breakpoints.up('sm')]: {
			marginTop: 70,
		},
	},
	paper_last: {
		marginTop: 20,
		marginBottom: 20,
		[theme.breakpoints.down('sm')]: {
			marginBottom: 70,
		},
	},
	progressButton: {
		margin: '0 auto',
	},
	title: {
		marginBottom: theme.spacing(3),
	},
	linkButton: {
		color: 'inherit',
		textDecoration: 'none'
	}
}))

const getStats = async (token) => {
	return fetch(`/api/stats`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			}
		})
		.then(response => response.json())
		.catch(e => console.error(e))
}

const getCfps = async (token) => {
	return fetch(`/api/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': token
			}
		})
		.then(response => response.json())
		.catch(e => console.error(e))
}

const Index = ({ auth }) => {

	const css = useStyles();
	const [cfp, setCfp] = useState({})
	const [stats, setStats] = useState({})

	const updateCfp = async (cfp) => {
		const stats = await getStats(auth.token)
		setCfp(cfp)
		setStats(stats)
	}

	//const { classes, auth: {login, isAdmin, token} } = this.props

	let stageLabel = ''
	if (cfp.stage) {
		stageLabel = VoteUIConfig.voting_stages[cfp.stage].label
	}

	return (<><div className={css.centered}>

		<Grid container spacing={24}>
			<Grid item xs={12}>
				<Paper className={classNames(css.paper, css.paper_first)} elevation={0}>
					<Typography className={css.title} variant="h2">
						{/* Hello {login} */} User page
					</Typography>
				</Paper>
			</Grid>
{/* 
			{ cfp.year ? (<>

				<Grid item xs={12}>
					<Typography variant="body1">
						Voting Progress for {stageLabel}
					</Typography>
				</Grid>

				<Grid item xs={12} sm={3}>

					<Typography variant="body1" component="div">
						<Progress name={login} stats={stats} />
					</Typography>

					<Typography component="div">
						<Link to="vote">
							<Button
								className={classes.progressButton}
								color="secondary"
								variant={'contained'}
								href=""
							>
								<a className={classes.linkButton}>
									Go Vote!
								</a>
							</Button>
						</Link>
					</Typography>

				</Grid>

				<Grid item xs={12} sm={3}>

					<Typography variant="body1" component="div">
						<TotalProgress stats={stats} />
					</Typography>

				</Grid>
			</>) : (<Grid item xs={12}><Typography variant="body1">
				CFP is not configured yet, check back later
			</Typography></Grid>) }
 */}
			{/* <Grid item xs={12}>
				<Paper className={classNames(classes.paper, classes.paper_last)} elevation={0}>
				{(isAdmin ? (
					<AdminMenu
						onUpdate={(data) => this.updateCfp(data)}
						token={ token }
						year={ cfp.year }
						stage={ cfp.stage }
					/>
				) : '')}
				</Paper>
			</Grid> */}
		</Grid>
	</div>
	<MenuBar /></>)
}


Index.getInitialProps = async ({ auth }) => {

	return {
		auth,
	}
}

export default Authenticated(Index)