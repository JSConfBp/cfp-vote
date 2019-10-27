import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function AlignItemsList() {
  const classes = useStyles();


const users = [
  {
    login: 'necccc',
    admin: true,
    name: 'Szabolcsi-Toth Szabolcs'
  },
  {
    login: 'freevo',
    name: 'Peter Frivalszlky'
  },
  {
    login: 'benedekgagyi',
    name: 'Ben Gagyi'
  }
]

  return (
    <List className={classes.root}> 
      { users.map((user, i) => (
        <React.Fragment key={user.login}>
         <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary={ user.login }
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  { user.name }
                </Typography>
                { user.admin && " — admin" }
              </React.Fragment>
            }
          />
          { !user.admin && <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>}
        </ListItem>
        { i !== users.length - 1 && (<Divider variant="inset" component="li" />)}
        </React.Fragment>
      ))}
    </List>
  );
}