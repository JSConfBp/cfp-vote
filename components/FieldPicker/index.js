import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import styles from './styles'
const useStyles = makeStyles(styles)


export default ({ fields, onHasFields }) => {
	const css = useStyles();
	const [checked, setChecked] = useState([])
	const [disabledList, setDisabledList] = useState(false)

	const handleToggle = (id) => {

		let newData = checked.slice(0)

		if (checked.includes(id)) {
			newData = newData.filter(item => (item !== id))
		} else {
			newData.push(id)
		}

		setDisabledList(newData.length >= 3)
		setChecked(newData)
	}

	const upload = () => {
    const data = checked.map(id => {
      return fields.find(element => element.id === id)
    })
		onHasFields(data)
	}

	return (<>
		<Typography variant="body1" component="p" className={ css.text }>
			Pick maximum 3 fields you wish to show during the voting process. <br />
			To help bias-free voting, avoid fields that might reveal the submitter's identity.<br />
      No need to pick all 3, if you wish you can pick two or a single one.
		</Typography>

		<Typography variant="body1" component="p" className={ css.text }>
			If you've picked the fields, click "Next" at the bottom of the list.
		</Typography>

		<List className={css.list}>
		{fields.map((item) => (
			<ListItem
				key={`field_${item.id}`}
				role={undefined}
				dense
				button
				disabled={ !checked.includes(item.id) && disabledList }
				onClick={e => handleToggle(item.id)}
			>
				<Checkbox
					checked={ checked.includes(item.id) }
					tabIndex={-1}
					disableRipple
				/>
				<ListItemText primary={item.field} />
			</ListItem>
		))}
		</List>

		<Button
			variant={'contained'}
			color="primary"
			className={css.button}
			onClick={e => upload()}
		>
			Next
		</Button>


	</>)
}


