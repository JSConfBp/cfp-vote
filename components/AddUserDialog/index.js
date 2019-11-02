import React, { useState, useRef } from 'react';
import fetch from 'isomorphic-unfetch'
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import HelpOutline from '@material-ui/icons/HelpOutline';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import styles from './styles'
const useStyles = makeStyles(styles)


const findGithubUser = async (username) => {
    return fetch(`https://api.github.com/users/${username}`)
        .then(res => res.json())
}


export default ({ 
    open = true, 
    onClose = () => {},
}) => {
    const css = useStyles();
    const inputTimer = useRef(0)
    const search = useRef('')

    const [user, setUser] = useState(null)

    const onSearch = (text) => {
        clearTimeout(inputTimer.current)
        inputTimer.current = setTimeout(async () => {
            if (search.current) {
                try {
                    const data = await findGithubUser(search.current)
                    setUser(data)
                } catch (e) {
                    console.log(e);
                }
            } else {
                setUser(null)
            }
        }, 300)
        
        if (!text) { 
            setUser(null)
        } else {
            setUser({ loading: true })
        }

        search.current = text
    }

    return (
        <Dialog open={open} onClose={ () => onClose() } aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add a new user by searching for their GitHub username
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="user"
              label="Search for GitHub username"
              type="text"
              fullWidth
              onChange={ e => onSearch(e.target.value) }
            />
            <Box className={ css.searchResult }>
                { user && (
                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            { user.loading && (
                                <CircularProgress className={ css.progress } color="secondary" />
                            )}
                            { user.avatar_url && (
                                <Avatar alt={ user.name } src={ user.avatar_url } />
                            )}
                            { user.message && (
                                <HelpOutline />
                            )}
                        </ListItemAvatar>
                        <ListItemText
                            primary={ user.login }
                            secondary={
                            <>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={css.inline}
                                    color="textPrimary"
                                >
                                { user.name || user.message }
                                </Typography>
                            </>
                            }
                        />
                    </ListItem>
                </List>
                )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={ () => onClose() } color="primary">
              Cancel
            </Button>
            <Button onClick={ () => onClose(user) } variant={ 'contained' } color="secondary" disabled={ !(user && !!user.login) }>
              Add
            </Button>
          </DialogActions>
        </Dialog>
    )
  }