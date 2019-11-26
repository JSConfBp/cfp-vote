import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import StepActivate from './Activate'
import StepAuthenticate from './Authenticate'
import StepChooseSheet from './ChooseSheet'
import StepChooseFields from './ChooseFields'
import StepImportData from './ImportData'


import ErrorNotification from '../ErrorNotification'


const styles = theme => ({
  container: {
		display: 'block',
		width: '100%'
  },
	importStepper: {
		paddingLeft: 0,
		paddingRight: 0
	},
	stepContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	}
});

class ImportCfp extends React.Component {
	state = {
	  name: 'Composed TextField',
	};

	constructor (props) {
		super(props)

		this.state = {
			activeStep: 0,
			year: 2019
		}
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

  getSteps() {
		return [
			'Enable Google Sheets API',
			'Authenticate',
			'Choose Sheet',
			'Pick Fields',
			'Import data'
		];
	}

	onActivated ({ needAuth, authUrl }) {
		if (needAuth) {
			this.setState({ authUrl })
			this.handleStep(1)
			return
		}

		this.handleStep(2)
	}

	onAuthenticated (data) {
		if (data.success) {
			this.handleStep(2)
		}
	}

	onHasSheet (fields) {
		this.setState({
			fields
		})

		this.handleStep(3)
	}

	onHasFields(selectedFields) {
		this.setState({
			selectedFields
		})
		this.handleStep(4)
	}

	onError(error) {
		this.setState({
			error
		})
	}

	getStepContent(step) {
		switch (step) {
			case 0:
				return <StepActivate
					onActivated={data => this.onActivated(data)}
					token={ this.props.token }
					onError={ e => this.onError(e) }
				/>;
			case 1:
				return <StepAuthenticate
					onAuthenticted={data => this.onAuthenticated(data)}
					authUrl={ this.state.authUrl}
					token={ this.props.token }
					onError={ e => this.onError(e) }
				/>;
			case 2:
				return <StepChooseSheet
					onHasSheet={data => this.onHasSheet(data)}
					token={ this.props.token }
					onError={ e => this.onError(e) }
				/>;
			case 3:
				return <StepChooseFields
					onHasFields={(selectedFields) => this.onHasFields(selectedFields) }
					fields={ this.state.fields }
					token={ this.props.token }
					onError={ e => this.onError(e) }
				/>;
			case 4:
				return <StepImportData
					selectedFields={ this.state.selectedFields }
					token={ this.props.token }
					onError={ e => this.onError(e) }
				/>;
			default:
				return 'Unknown step';
		}
	}

	handleStep = step => {
    this.setState({
      activeStep: step,
    });
  };

	render() {
	  const { classes } = this.props;
		const { activeStep, error } = this.state;
		const steps = this.getSteps();

	  return (
		<div className={classes.container}>
			<Stepper activeStep={activeStep} className={classes.importStepper}>
			{steps.map((label, index) => (
				<Step key={label}>
					<StepButton>
						{label}
					</StepButton>
				</Step>
			))}
			</Stepper>

			<div className={classes.stepContent} >
				{this.getStepContent(activeStep)}
			</div>

			<ErrorNotification error={ error } />
		</div>
		);
	}
  }

  export default withStyles(styles)(ImportCfp);
