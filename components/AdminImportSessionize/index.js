import React, { useState } from 'react'
import Paper from '@mui/material/Paper';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

import StepAddSessionizeAPI from './AddSessionizeAPI'
import StepChooseFields from './ChooseFields'
import StepImportData from './ImportData'
import { useTheme } from '@emotion/react';



const steps = [
  'Add Sessionize API URL',
  'Pick Fields',
  'Import data'
];

export default ({ onComplete }) => {
  const theme = useTheme()
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
		<div sx={{
      display: 'block',
      width: '100%'
    }}>
			<Stepper activeStep={activeStep} sx={{
		paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent'
  }}>
			{steps.map((label, index) => (
				<Step key={label}>
					<StepButton>
						{label}
					</StepButton>
				</Step>
			))}
			</Stepper>

      <Paper sx={ {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: '60vw',
    margin: '0 auto',
    marginTop: theme.spacing(4),
    padding: theme.spacing(4)
  }}>
				{ getStepContent(activeStep) }
      </Paper>
		</div>
  );
}
