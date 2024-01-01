import React, { useState } from 'react'

import Paper from '@mui/material/Paper';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Box from '@mui/material/Box';
import StepButton from '@mui/material/StepButton';

import StepActivate from './Activate'
import StepAuthenticate from './Authenticate'
import StepChooseSheet from './ChooseSheet'
import StepChooseFields from './ChooseFields'
import StepImportData from './ImportData'
import { useTheme } from '@emotion/react';

const steps = [
  'Enable Google Sheets API',
  'Authenticate',
  'Choose Sheet',
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
          next={ onComplete }
				/>;
			default:
				return 'Unknown step';
		}
	}

  return (
		<Box>
			<Stepper activeStep={activeStep} sx={ {
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

      <Paper sx={{
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
		</Box>
  );
}
