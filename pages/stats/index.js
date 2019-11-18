import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles'
import getConfig from 'next/config'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { useNotification } from 'notification-hook'

import Histogram from '../../components/Histogram'
import StagedVotesChart from '../../components/StagedVotesChart'

import Authenticated from '../../components/Auth'
import MenuBar from '../../components/MenuBar';
import Progress from '../../components/Progress'

import styles from './styles'
const useStyles = makeStyles(styles)


const getCfp = async () => {
	return fetch(`/api/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
	.then(response => response.json())
}

const getStats = async () => {
	return fetch(`/api/stats`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
		.then(response => response.json())
}

const getHistogram = async () => {
	return fetch(`/api/histogram`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
		.then(response => response.json())
}

const Stats = () => {
  const css = useStyles()
  const { showError } = useNotification()
  const [loading, setLoading] = useState(true)
  const [histogram, setHistogram] = useState(null)
  const [stats, setStats] = useState([])
  const [cfp, setCfp] = useState(null)

  useEffect(() => {
    Promise.all([
      getHistogram(),
      getStats(),
      getCfp()
    ]).then(data => {
      setHistogram(data[0])
      setStats(data[1])
      setCfp(data[2])
      setLoading(false)
    }).catch(e => showError(e.message))
  }, [false])

  return (<div className={css.root}>
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Paper className={css.paper} elevation={0}>
        <Typography className={css.title} variant="h2">
          Statistics
        </Typography>

        { loading && (<Typography variant="body1">
            Loading ...
          </Typography>) }

        { !loading && cfp && !cfp.count && (
          <Typography variant="body1">
            CFP is not configured yet, check back later
          </Typography>
        ) }

        { !loading && cfp && !!cfp.count && (
          <Typography variant="body1" component="div" className={ css.stats }>
            {stats.map(stat => (
              <Progress key={`${stat.user}-votes`} name={stat.user} stats={stats} />
            ))}
          </Typography>
        )}

        { !loading && histogram && Object.entries(histogram.votes).map(([stage, data]) => (
          <Histogram stage={ stage } data={ data } key={`hist_${stage}`} />
        )) }


        { !loading && histogram && Object.entries(histogram.talks).filter((data) => (data[1].length > 0)).map(([stage, data]) => {
          return (<StagedVotesChart stage={ stage } data={ data } key={`chart_${stage}`} />)
        }) }
      </Paper>
    </Grid>
  </Grid>
  <MenuBar />
  </div>)
}


export default Authenticated(Stats)
