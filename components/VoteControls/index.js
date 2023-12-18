
import Button from '@mui/material/Button';

import VoteUIConfig from '../../cfp.config'
import { useTheme } from '@emotion/react';

const VoteControls = (props) => {
  const theme = useTheme()
		const { classes, stage, loading = false } = props
		const votingUi = VoteUIConfig.votingStages[stage].voteUI

	  return (
		<>
			{votingUi.map((vote, i) => (
				<Button
					disabled={ loading }
					sx={{
            flexBasis: '24%',
            marginBottom: 0,
            background: 'white',
            padding: '15px 0',
            fontSize: theme.spacing.unit * 2.2,
            [theme.breakpoints.down('sm')]: {
              fontSize: theme.spacing.unit * 3,
              flexBasis: `49%`,
              padding: '15px 0',
              marginBottom: 0.5
            },
            [theme.breakpoints.down('xs')]: {
              fontSize: theme.spacing.unit * 2,

            },
          }}
					key={`vote_${vote.value}`}
					onClick={e => props.onVote(vote.value)}
					variant={'outlined'}
					color="primary">
						{ vote.label }
				</Button>
			))}

		</>
		);
	}

  export default VoteControls;
