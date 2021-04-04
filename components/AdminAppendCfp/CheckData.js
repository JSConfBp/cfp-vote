import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styles from './styles'
const useStyles = makeStyles(styles)

export default ({ count: { gsheet = 0, sessionize = 0}, next }) => {
  const css = useStyles();

  const count = gsheet + sessionize
  return (<>

  {count === 0 &&
    <Typography variant="body1" component="p">
      There are no new CFP submission available for import.
    </Typography>
  }

  {count > 0 && <>
    <Typography variant="body1" component="p">
      There {count > 1 ? 'are' : 'is' } {count} new CFP submission{count > 1 ? 's' : '' } available for import.
    </Typography>

    <Typography variant="body1" component="p">
      Click the button below, to start
    </Typography>
    </>
  }

  <Button
    disabled={ count === 0 }
    variant="contained"
    className={ css.nextButton }
    color="primary"
    target="_blank"
    rel="noopener"
    onClick={ next }
  >
    Start import
  </Button>
</>)
}
