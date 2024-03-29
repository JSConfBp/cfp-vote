import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import getConfig from 'next/config'

import VoteUIConfig from '../../cfp.config'

const { publicRuntimeConfig: { api_url } } = getConfig()


class Download extends React.Component {

	constructor (props) {
		super(props)

		this.state = {
			csv: '',
			loading: false,
			success: false
		}
	}

	saveDownload() {
		const fileName = `${VoteUIConfig.title.replace(' ', '_')}.csv`
		const blob = new Blob([this.state.csv], { type: 'text/csv;charset=utf-8;' });

		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, fileName);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", fileName);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	async downloadClick() {

		this.setState({
			loading: true
		})

		const { token } = this.props

		try {
			const result = await fetch(`${api_url}/v1/download`, {
				method: 'GET',
				headers: {
					'Accept': 'text/csv',
					'Authorization': token
				}
			}).then(body => body.text())

			this.setState({
				csv: result,
				loading: false,
				success: true
			})

			this.saveDownload()

		} catch (e) {
			this.setState({
				loading: false,
				success: false
			})
			console.error(e);
		}
	}

	render() {
		const { classes } = this.props
		const { loading, success } = this.state

		return (<div>
			<Button

				onClick={e => this.downloadClick()}
				color="primary"
				variant={'outlined'}
				disabled={loading}
			>
				Download data
				{loading && <CircularProgress size={24} />}
			</Button>
			</div>);
	}
  }

  export default Download;
