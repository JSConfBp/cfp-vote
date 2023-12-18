import React from 'react'
import Typography from '@mui/material/Typography';
import Page from '../components/Page'
import VoteUIConfig from '../cfp.config'
import { useTheme } from '@emotion/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

const Index = () => {
  const theme = useTheme()

	return (<Page>
		<div sx={{
		width: '80vw',
		paddingTop: 16,
		paddingBottom: 16,
		margin: '0 auto',
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	}}>
			<Typography sx={{
		marginBottom: theme.spacing(3),
	}} variant="h2">
				{ VoteUIConfig.title }
			</Typography>

		</div>
	</Page>)
}

export default Index


export const getServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  if (session) {
    return {
      redirect: {
        destination: '/user',
        permanent: false,
      },
    }
  }
}
