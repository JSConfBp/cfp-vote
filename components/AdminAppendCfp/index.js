import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';

import StepActivate from '../AdminImportCfp/Activate'
import StepAuthenticate from '../AdminImportCfp/Authenticate'
import StepCheckData from './CheckData'

import { useNotification } from 'notification-hook'

import styles from './styles'
const useStyles = makeStyles(styles)


const steps = {
  gsheet: [
    'Enable Google Sheets API',
    'Authenticate',
    'Choose Sheet',
    'Check new data',
    'Append new data'
  ],
  sessionize: [
    'Collecting',
    'Check new data',
    'Append new data'
  ]
};

export default ({ onComplete }) => {
  const css = useStyles();
  const [ loading, setLoading ] = useState(true)
  const [ source, setSource ] = useState()

  const [ cfp, setCfp ] = useState({})

  const [ activeStep, setActiveStep ] = useState(0)
  const [ authUrl, setAuthUrl ] = useState('')
  const { showError, showSuccess } = useNotification()

  const [ newDataCount, setNewDataCount ] = useState({})

  useEffect(() => {
    fetch('/api/cfp', {
			method: 'get',
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
    })
    .then(r => r.json())
    .then(data => {
      if (data.gsheet && !data.sessionize) {
        setSource('gsheet')
        setSourceGsheets()
      } else if (!data.gsheet && data.sessionize) {
        setSource('sessionize')
        setSourceSessionize()
      }

      setCfp(data)
      setLoading(false)
    })
    .catch(e => showError("Failed to set up"))
  }, [false])


  const setSourceGsheets = () => {
    fetch('/api/cfp/append/gsheet', {
			method: 'get',
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setNewDataCount(data.count)
        setActiveStep(3)
        setLoading(false)
      }
    })
    .catch(e => showError("Failed to set up"))
  }

  const setSourceSessionize = () => {
    fetch('/api/cfp/append/sessionize', {
			method: 'get',
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setNewDataCount(data.count)
        setActiveStep(1)
        setLoading(false)
      }
    })
    .catch(e => showError("Failed to set up"))
  }

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
    fetch(`/api/cfp/append/${source}`, {
			method: 'put',
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        onComplete()
        showSuccess('Import complete')
      }
    })
    .catch(e => showError("Failed to import"))
	}

	const getStepContent = (step, source, newDataCount) => {
    if (source === 'gsheet') {


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

    if (source === 'sessionize') {
      switch (step) {
        case 0:
          return <p>Collecting data...</p>;
        case 1:
          return <StepCheckData
            count={ newDataCount }
            next={ () => startImport() }
          />;
        case 2:
          return <>
            <Typography variant="body1" component="p">
              Running import...
            </Typography>
          </>;
        default:
          return 'Unknown step';
      }
    }
	}

  const getSource = () => {
    return <>
      Choose source:


  <Button
    variant="contained"
    className={ css.nextButton }
    color="primary"
    target="_blank"
    rel="noopener"
    onClick={ () => {
      setSource('gsheet')
      setSourceGsheets()
    } }
  >
    Google Sheets
  </Button>

  <Button
    variant="contained"
    className={ css.nextButton }
    color="primary"
    target="_blank"
    rel="noopener"
    onClick={ () => {
      setSource('sessionize')
      setSourceSessionize()
    } }
  >
    Sessionize
  </Button>
    </>
  }

  return (
    <div className={css.container}>
      { source && <Stepper activeStep={activeStep} className={css.importStepper}>
        {steps[source].map((label, index) => (
          <Step key={label}>
            <StepButton>
              {label}
            </StepButton>
          </Step>
        ))}
			</Stepper>}

      <Paper className={css.stepContent}>

        { source ? getStepContent(activeStep, source, newDataCount) : getSource() }

        { source && <Typography variant="body1" component="p">
          <Button
            className={ css.nextButton }
            color="secondary"
            target="_blank"
            rel="noopener"
            onClick={ () => {
              setSource(null)
            } }
          >
            Choose another source
          </Button>
        </Typography> }

      </Paper>
      <Backdrop open={loading} className={css.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
		</div>
  );
}
