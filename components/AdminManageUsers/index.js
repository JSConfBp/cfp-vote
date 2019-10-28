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

	const getUsers = () => fetch('/api/users')
		.then(res => res.json())
		.then(data => {
			setUsers(data.users || [])
			setLoading(false)
		})
		
	const onUserModalClose = async (data) => {		
		if (data) {
			try {
				await fetch('/api/user', {
					method: 'post',
					headers: {
						"Content-Type": "application/json; charset=utf-8"
					},
					body: JSON.stringify({ login: data.login })
				})
				await getUsers()
			} catch (e) {
				onError('Could not save user', e)
			}
		}
		setModalOpen(false)
	}
		
	const removeUser = async (user) => {
		console.log('removeUser', user);
		try {
			await fetch('/api/user', {
				method: 'delete',
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				},
				body: JSON.stringify({ user })
			})
			await getUsers()
		} catch (e) {
			onError('Could not remove user', e)
		}
	}
	

	useEffect(() => {
		setLoading(true)
		getUsers()
	}, [false])

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
				<Button 
					variant={ 'contained' } 
					color="secondary" 
					onClick={ () => setModalOpen(true) }
				>
					Add new user
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h6">
					Current users
				</Typography>
			</Grid>
			<Grid item xs={12}>		
				<UserList 
					users={ users }
					loading={ loading } 
					removeUser={ user => removeUser(user) }
				/>
			</Grid>
			<AddUserDialog 
				open={ modalOpen } 
				loading={ loading } 
				onClose={ (data) => onUserModalClose(data) }
			/>
		</Grid>
	)
}