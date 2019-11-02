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

	const handleToggle = (index) => {
		
		let newData = checked.slice(0)

		if (checked.includes(index)) {
			newData = newData.filter(item => (item !== index))
		} else {
			newData.push(index)
		}

		setDisabledList(newData.length >= 3)
		setChecked(newData)
	}

	const upload = () => {
		onHasFields(checked)
	}

	return (<>
		<Typography variant="body1" component="p" className={ css.text }>
			Pick 3 fields you wish to show during the voting process. <br />
			To help bias-free voting, avoid fields that might reveal the submitter's identity.
		</Typography>

		<Typography variant="body1" component="p" className={ css.text }>
			If you've picked the fields, click "Next" at the bottom of the list.
		</Typography>

		<List className={css.list}>
		{fields.map((field, i) => (
			<ListItem
				key={`field_${i}`}
				role={undefined}
				dense
				button
				disabled={ !checked.includes(i) && disabledList }
				onClick={e => handleToggle(i)}
			>
				<Checkbox
					checked={ checked.includes(i) }
					tabIndex={-1}
					disableRipple
				/>
				<ListItemText primary={field} />
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


  