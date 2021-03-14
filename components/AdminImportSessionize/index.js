import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';

import StepAddSessionizeAPI from './AddSessionizeAPI'
import StepChooseFields from './ChooseFields'
import StepImportData from './ImportData'

import styles from './styles'
const useStyles = makeStyles(styles)


const steps = [
  'Add Sessionize API URL',
  'Pick Fields',
  'Import data'
];

export default ({ onComplete }) => {
  const css = useStyles();
  const [ activeStep, setActiveStep ] = useState(0)
  const [ authUrl, setAuthUrl ] = useState('')
  const [ fields, setFields ] = useState([])
  const [ selectedFields, setSelectedFields ] = useState([])
  const [ sheetMetadata, setSheetMetadata ] = useState({})



	const onHasAPI = (
    fields
  ) => {
    setFields(fields)

		setActiveStep(1)
	}

	const onHasFields = (selectedFields) => {
		setSelectedFields(selectedFields)
		setActiveStep(2)
	}

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return <StepAddSessionizeAPI
					next={ data => onHasAPI(data) }
				/>;
			case 1:
				return <StepChooseFields
					next={(selectedFields) => onHasFields(selectedFields) }
					fields={ fields }
				/>;
			case 2:
				return <StepImportData
          selectedFields={ selectedFields }
          next={ onComplete }
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
