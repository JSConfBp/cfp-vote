import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
		display: 'block'
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  button: {
		color: '',
	  marginTop: theme.spacing.unit * 5,
  },
  input: {
	  display: 'none'
	},
	field: {

	}
});

class UploadCfp extends React.Component {
	state = {
	  name: 'Composed TextField',
	};

	constructor (props) {
		super(props)
		this.state = { year: 2019 }
	}

	handleChange = event => {
	  const reader = new FileReader();
	  reader.readAsText(event.target.files[0]);
	  reader.onload = (event) => {
			const { year } = this.state
			this.props.onFile(year, event.target.result)
		};
	};

	handleYear = year => {
		this.setState({ year })
	}

	render() {
	  const { classes } = this.props;

	  return (
		<div className={classes.container}>
			<div className={classes.field}>
				<TextField
          id="cfp-year"
					label="Year"
					value={this.state.year}
          onChange={e => this.handleYear(e.target.value)}
          type="number"
          margin="normal"
        />
			</div>
			<div className={classes.field}>
				<input
					accept="text/csv"
					className={classes.input}
					id="raised-button-file"
					multiple
					type="file"
					onChange={this.handleChange}
				/>
				<label htmlFor="raised-button-file">
					<Button variant={'contained'} color="secondary" component="span" className={classes.button}>
						Upload submissions as CSV export
					</Button>
				</label>
			</div>

		</div>
		);
	}
  }

  export default withStyles(styles)(UploadCfp);