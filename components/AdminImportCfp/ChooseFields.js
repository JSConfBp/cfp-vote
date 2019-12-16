import React from 'react'
import { withStyles } from '@material-ui/core/styles';


import FieldPicker from '../FieldPicker'

import getConfig from 'next/config'
const { publicRuntimeConfig: { api_url } } = getConfig()

const styles = theme => ({
	container: {
		display: 'block',
		width: '100%'
	},
});

class ChooseFields extends React.Component {

	render () {
		const { fields, token } = this.props

		return (<>
			<FieldPicker fields={ fields } onHasFields={ (data) => this.props.onHasFields(data) } />
		</>)
	}
  }


  export default withStyles(styles)(ChooseFields);