import React, { useState, useEffect } from 'react'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import CircularProgress from '@mui/material/CircularProgress'
import Page from '../../components/Page'
import Box from '@mui/material/Box'
import { useNotification } from '../../components/NotificationHook'

import VoteControls from '../../components/VoteControls'
import { useSession } from 'next-auth/react'
import { useTheme } from '@emotion/react'

const getCfp = async () => {
	return fetch(
		`/api/cfp`,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
	.then(response => response.json())
}

const getNextTalk = async (token) => {
	return fetch(`/api/talk`,
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

const Vote = () => {
  const theme = useTheme()
  const { data: session } = useSession()
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const { showError, showSuccess } = useNotification()
	const [talk, setTalk] = useState(null)
	const [cfp, setCfp] = useState(null)
  const [stats, setStats] = useState(null)
  const [fieldType, setFieldType] = useState('')

	useEffect(() => {
		Promise.all([
			getCfp(),
			getNextTalk(),
      getStats()
		]).then(([cfp, talk, stats]) => {
			setCfp(cfp)
			setTalk(talk)
      setStats(stats[0])
      if (!talk.completed) {
        setFieldType(talk.id.split('_')[0])
      }
			setLoading(false)
		})
	}, [false])

	const onVote = async (id, value) => {
		setLoading(true)

		const voted = await fetch(`/api/vote`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({id, value})
			})
			.then(response => response.json())
			// TODO 4xx status is also a succesful fetch :/
			.catch(e => {
				showError('Could not save vote!')
				console.error(e);
			})

		if (voted.success) {
			setModalOpen(false)
			const talk = await getNextTalk()
      const stats = await getStats()
      setTalk(talk)
      setStats(stats[0])
      if (talk.completed) {
        setLoading(false)
        return;
      }
      setFieldType(talk.id.split('_')[0])
			setLoading(false)

			window.scrollTo(0,0)
		}
	}

	const { completed } = talk || { completed: true }

  if (!session || !session.user) {
    return <></>
  }

  const subTitle = completed ? '':  `Talk ${stats.count + 1} / ${stats.total}`

	return (<Page voting={!completed} subTitle={subTitle}>
	{ !loading && (
		<Grid container spacing={ 24 }>
			<Grid item xs={ 12 }>
				<Box>
					{completed && (<Typography
						variant="body1"
					>
						Nice job, you're completed voting in this stage.
					</Typography>) }

          { talk && !completed && (cfp.fields[fieldType]
              .filter(({field}) => field.toLowerCase().includes('title'))
              .map(({field}, i) => {
                return (<Typography
									variant="h4"
									key={ `field-${i}` }
								>
									{ talk.fields[field] }
								</Typography>)
              })
          )}

          { talk && !completed && (cfp.fields[fieldType]
            .filter(({field}) => !field.toLowerCase().includes('title'))
            .map(({field}, i) => {

								return (<Typography
                  variant="body1"
                  component="div"
									key={ `field-${i}` }
                  sx={{
                    ...(i > 0 && { fontStyle: 'italic' })
                  }}
								>
                  <p><strong>{field}</strong></p>
                  { talk.fields[field].split(/\n\n/).map((p, key) => (<p key={`p-${key}`}>{ p }</p>)) }
								</Typography>)

						})
					)}
				</Box>

				{ !completed && (
				<Box sx={{
          paddingBlock: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          [theme.breakpoints.down('md')]: {
            flexWrap: 'wrap',
            flexDirection: 'row'
          }
        }}>
					<VoteControls
						loading={ loading }
						onVote={ value => onVote(talk.id, value) }
						stage={ cfp.stage }
					/>
				</Box>
				) }
			</Grid>
		</Grid>
	)}

	{ (loading) && (
		<Grid container spacing={ 24 }>
			<Grid item xs={ 12 }>
				<Paper elevation={ 0 } >
					<CircularProgress color="secondary"  />
				</Paper>
			</Grid>
		</Grid>
	)}

	{ cfp && talk && (
		<Modal
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			open={ modalOpen }
			onClose={ e => setModalOpen(false) }
		><div>
			<VoteControls
				loading={ loading }
				onVote={ value => onVote(talk.id, value) }
				stage={ cfp.stage }
			/>
			</div>
		</Modal>
	)}
</Page>)
}

export default Vote
