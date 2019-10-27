import React, { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import AddUserDialog from '../AddUserDialog'
import UserList from '../UserList'

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ onUpdate, onError }) => {
	const css = useStyles();

	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [users, setUsers] = useState([])

	useEffect(() => {
		setLoading(true)
		fetch('/api/users')
			.then(res => res.json())
			.then(users => {
				console.log(users);

				setLoading(false)
			})
	}, [false])

	const onUserModalClose = async (data) => {
		console.log(data)
		
		if (data) {
			try {
				await fetch('/api/user', {
					method: 'post',
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
					body: JSON.stringify({ login: data.login })
				})
			} catch (e) {
				onError('Could not save user', e)
			}
		}

		setModalOpen(false)
		// save data
		// fetch new list
	}

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h4" className={ css.heading }>
					Manage users
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>
					Manage your team, who has access to the CFP voting. Add users by their GitHub usernames.
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button variant={ 'contained' } color="secondary" onClick={ () => setModalOpen(true) }>Add new user</Button>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h6">
					Current users
				</Typography>
				<UserList 
					users={ users }
					loading={ loading } />
			</Grid>
			<AddUserDialog 
				open={ modalOpen } 
				loading={ loading } 
				onClose={ (data) => onUserModalClose(data) }
			/>
		</Grid>
	)
}