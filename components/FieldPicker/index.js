import React, { useState } from 'react'

import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';


export default ({ fields, onHasFields }) => {

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
		<Typography variant="body1" component="p">
			Pick maximum 3 fields you wish to show during the voting process. <br />
			To help bias-free voting, avoid fields that might reveal the submitter's identity.<br />
      No need to pick all 3, if you wish you can pick two or a single one.
		</Typography>

		<Typography variant="body1" component="p">
			If you've picked the fields, click "Next" at the bottom of the list.
		</Typography>

		<List>
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
			onClick={e => upload()}
		>
			Next
		</Button>


	</>)
}


