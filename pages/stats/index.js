import React from 'react'
import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Histogram from '../../components/Histogram'
import StagedVotesChart from '../../components/StagedVotesChart'

import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar';
import Progress from '../../components/Progress'

const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	stats: {
		display: 'flex',
		justifyContent: 'space-around',
		flexWrap: `wrap`,
	},
	paper: theme.mixins.gutters({
		background: 'none',
		margin: '0 auto',
		width: '80vw',
		marginTop: 20,
		[theme.breakpoints.down('sm')]: {
			marginBottom: 70,
		},
		[theme.breakpoints.up('sm')]: {
			marginTop: 70,
		},
		paddingTop: 32,
		paddingBottom: 32,
	}),
	title: {
		marginBottom: theme.spacing.unit * 3,
	},
	linkButton: {
		color: 'inherit',
		textDecoration: 'none'
	}
});

const getStats = async (token) => {
	return fetch(`${api_url}/v1/stats`,
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

const getHistogram = async (token) => {
	return fetch(`${api_url}/v1/histogram`,
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

class Index extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			cfp: props.cfp,
			stats: props.stats
		}
	}

	render() {
		const { cfp, stats } = this.state
		const { classes, histogram } = this.props

		return (<div className={classes.root}>
		<Grid container spacing={24}>
			<Grid item xs={12}>
				<Paper className={classes.paper} elevation={0}>
					<Typography className={classes.title} variant="h2">
						Statistics
					</Typography>

					{ cfp.year ? (<>
						<Typography variant="body1" component="div" className={ classes.stats }>
					{stats.map(stat => (
						<Progress key={`${stat.user}-votes`} name={stat.user} stats={stats} />

					))}
						</Typography>

					</>) : (<Typography variant="body1">
							CFP is not configured yet, check back later
						</Typography>) }


					{ Object.entries(histogram.votes).map(([stage, data]) => (
						<Histogram stage={ stage } data={ data } key={`hist_${stage}`} />
					)) }


					{ Object.entries(histogram.talks).map(([stage, data]) => {
						if (data.length > 0) return (<StagedVotesChart stage={ stage } data={ data } key={`chart_${stage}`} />)
					}) }
				</Paper>
			</Grid>
		</Grid>
		<MenuBar />
	  </div>)
	}

	static async getInitialProps({ req, res, store, auth }) {

		if (!auth || !auth.token) {
			if (res) {
				res.writeHead(302, {
					Location: '/'
				})
				res.end()
			} else {
				Router.push('/')
			}
			return
		}

		const cfp = await fetch(`${api_url}/v1/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': auth.token
			}
		})
		.then(response => response.json())
		.catch(e => console.error(e))

		const stats = await getStats(auth.token)
		const histogram = await getHistogram(auth.token)

		return {
			auth,
			stats,
			histogram,
			cfp
		}
	}
}


export default Authenticated(withStyles(styles)(Index))