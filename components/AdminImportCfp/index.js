import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import StepActivate from './Activate'
import StepAuthenticate from './Authenticate'
import StepChooseSheet from './ChooseSheet'
import StepChooseFields from './ChooseFields'
import StepImportData from './ImportData'

import styles from './styles'
const useStyles = makeStyles(styles)


const steps = [
  'Enable Google Sheets API',
  'Authenticate',
  'Choose Sheet',
  'Pick Fields',
  'Import data'
];

export default () => {
  const css = useStyles();
  const [ activeStep, setActiveStep ] = useState(0)
  const [ authUrl, setAuthUrl ] = useState('')
  const [ fields, setFields ] = useState([])
  const [ selectedFields, setSelectedFields ] = useState([])
  const [ sheetMetadata, setSheetMetadata ] = useState({})


	const onActivated = ({ needAuth, authUrl }) => {
		if (needAuth) {
			setAuthUrl(authUrl)
			setActiveStep(1)
			return
		}

		setActiveStep(2)
	}

	const onAuthenticated = () => {
    setActiveStep(2)
}

	const onHasSheet = ({
    fields,
    spreadSheetTitle,
    spreadSheetUrl,
    sheetTitle,
  }) => {
    setFields(fields)
    setSheetMetadata({
      spreadSheetTitle,
      spreadSheetUrl,
      sheetTitle,
    })
		setActiveStep(3)
	}

	const onHasFields = (selectedFields) => {
		setSelectedFields(selectedFields)
		setActiveStep(4)
	}

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return <StepActivate
					next={data => onActivated(data)}
				/>;
			case 1:
				return <StepAuthenticate
					next={() => onAuthenticated()}
					authUrl={ authUrl }
				/>;
			case 2:
				return <StepChooseSheet
					next={ data => onHasSheet(data) }
				/>;
			case 3:
				return <StepChooseFields
					next={(selectedFields) => onHasFields(selectedFields) }
					fields={ fields }
				/>;
			case 4:
				return <StepImportData
          sheetData={ Object.assign({}, sheetMetadata, { fields } )}
					selectedFields={ selectedFields }
				/>;
			default:
				return 'Unknown step';
		}
	}

  return (
		<div className={css.container}>
			<Stepper activeStep={activeStep} className={css.importStepper}>
			{steps.map((label, index) => (
				<Step key={label}>
					<StepButton>
						{label}
					</StepButton>
				</Step>
			))}
			</Stepper>

      <Paper className={css.stepContent}>
				{ getStepContent(activeStep) }
      </Paper>
		</div>
  );
}
