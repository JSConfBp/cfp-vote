import React from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@emotion/react';

export default ({ count: { gsheet = 0, sessionize = 0}, next }) => {
  const theme = useTheme()
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
    sx={ {
      marginTop: theme.spacing(4)
    }}
    color="primary"
    target="_blank"
    rel="noopener"
    onClick={ next }
  >
    Start import
  </Button>
</>)
}
