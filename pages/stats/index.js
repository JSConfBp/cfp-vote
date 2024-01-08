import React, { useState, useEffect } from 'react'

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNotification } from '../../components/NotificationHook'
import cfpConfig from '../../cfp.config'

import VotePieChart from '../../components/VotePieChart'
import StagedVotesChart from '../../components/StagedVotesChart'

import Progress from '../../components/Progress'
import { useSession } from 'next-auth/react';
import Page from '../../components/Page';

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
	return fetch(`/api/stats/histogram`,
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

  const { data: session } = useSession()

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

  if (!session || !session.user) {
    return <></>
  }

  return (<Page>
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Box>
        <Typography  variant="h3">
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
          <Typography variant="body1" component="div" sx={{ textAlign: 'center', margin: '3rem 0' }}>
            {stats.map(stat => (
              <Progress key={`${stat.user}-votes`} name={stat.user} stats={stats} />
            ))}
          </Typography>
        )}

        { !loading && histogram && Object.keys(cfpConfig.votingStages).map(stage => histogram.talks[stage].length > 0 && (<>
          <VotePieChart stage={ stage } data={ histogram.votes[stage] } key={`hist_${stage}`} />
          <StagedVotesChart stage={ stage } data={ histogram.talks[stage] } key={`chart_${stage}`} />
        </>))
        }

      </Box>
    </Grid>
  </Grid>

  </Page>)
}

export default Stats
