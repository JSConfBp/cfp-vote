import React, { useState, useEffect } from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Link from 'next/link'
import Box from '@mui/material/Box'
import Page from '../../components/Page'
import Progress from '../../components/Progress'
import TotalProgress from '../../components/TotalProgress'

import VoteUIConfig from '../../cfp.config'
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { useTheme } from '@emotion/react';


const getStats = async (token) => {
	return fetch(`/api/stats`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
}

const getCfp = async (token) => {
	return fetch(`/api/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
}

export default function Index () {

  const { data: session } = useSession()
  const theme = useTheme()


  const admin = false

  const [loadingState, setLoadingState] = useState('notloaded')

	const [cfp, setCfp] = useState({})
	const [stats, setStats] = useState([])

	useEffect(() => {
    setLoadingState('loading')
		Promise.all([
			getCfp(),
			getStats()
		])
			.then(([data, stats]) => {
				setCfp(data)
        setStats(stats)
        setLoadingState('finished')
			})
			.catch(e => {
        console.error(e);
        setLoadingState('finished')
			})
	}, [false])

	let stageLabel = ''

	if (cfp.stage) {
		stageLabel = VoteUIConfig.votingStages[cfp.stage].label
	}

  if (!session || !session.user) {
    return <></>
  }

	return (<Page>
		<Grid container spacing={3}>
			<Grid item xs={12}>
        <Typography variant="h4">
          Hello {session?.user.name}
        </Typography>
			</Grid>
      {
        loadingState !== 'notloaded'
        && loadingState !== 'loading'
        && !!cfp.count
        && (
          <>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ textAlign: 'left'}}>
                Voting Progress for {stageLabel}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>

              <Typography variant="body1" component="div">
                <Progress name={session.login} stats={stats} />
              </Typography>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Link href="/vote">
                  <Button
                    color="secondary"
                    variant={'contained'}
                  >
                    Go Vote!
                  </Button>
                </Link>
              </Box>

            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography variant="body1" component="div">
                <TotalProgress stats={stats} />
              </Typography>
            </Grid>
          </>
      )}

      {
        loadingState !== 'notloaded'
        && loadingState !== 'loading'
        && !cfp.count
        && (
        <Grid item xs={12}>
          <Typography variant="body1">
  				  Current CFP is not configured yet, please check back later.
          </Typography>
        </Grid>
      ) }

			<Grid item xs={12}>
				<Paper elevation={0}>
				{(admin ? (<>
					<Typography variant="h5" >
						Administration
					</Typography>

					<Typography variant="body1" >
						You're marked as an admin, so you can access some advanced features.<br />
						But be careful, you know <em>"with great power comes great responsibility"</em>!
					</Typography>
					<Typography variant="body1" >
						<Link href="/admin">
							<a >
								Go to the Admin page
							</a>
						</Link>
					</Typography>

				</>) : '')}
				</Paper>
			</Grid>
		</Grid>

	</Page>)
}


export const getServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}
  }
}
