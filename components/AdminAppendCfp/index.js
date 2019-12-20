import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';

import StepActivate from '../AdminImportCfp/Activate'
import StepAuthenticate from '../AdminImportCfp/Authenticate'
import StepCheckData from './CheckData'

import { useNotification } from 'notification-hook'

import styles from './styles'
const useStyles = makeStyles(styles)


const steps = [
  'Enable Google Sheets API',
  'Authenticate',
  'Choose Sheet',
  'Check new data',
  'Append new data'
];

export default ({ onComplete }) => {
  const css = useStyles();
  const [ loading, setLoading ] = useState(true)
  const [ activeStep, setActiveStep ] = useState(0)
  const [ authUrl, setAuthUrl ] = useState('')
  const { showError, showSuccess } = useNotification()

  const [ newDataCount, setNewDataCount ] = useState(0)

  useEffect(() => {
    fetch('/api/cfp/append', {
			method: 'get',
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
    })
    .then(r => r.json())
    .then(data => {
      console.log(data);

      if (data.success) {
        setNewDataCount(data.count)
        setActiveStep(3)
        setLoading(false)
      }
    })
    .catch(e => showError("Failed to set up"))
  }, [false])



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

	const startImport = () => {
    setActiveStep(4)
    fetch('/api/cfp/append', {
			method: 'put',
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
    })
    .then(r => r.json())
    .then(data => {
      console.log(data);

      if (data.success) {
        onComplete()
        showSuccess('Import complete')
      }
    })
    .catch(e => showError("Failed to import"))
	}

	const getStepContent = (step) => {
		switch (step) {
      case 0:
        return <p>Collecting data...</p>;

			case 1:
				return <StepActivate
					next={data => onActivated(data)}
				/>;
			case 2:
				return <StepAuthenticate
					next={() => onAuthenticated()}
					authUrl={ authUrl }
				/>;
			case 3:
				return <StepCheckData
          count={ newDataCount }
					next={ () => startImport() }
				/>;
			case 4:
				return <>
          <Typography variant="body1" component="p">
            Running import...
          </Typography>
        </>;
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
      <Backdrop open={loading} className={css.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
		</div>
  );
}
