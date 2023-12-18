import { useTheme } from '@emotion/react';
import MenuBar from '../MenuBar';
import Box from '@mui/material/Box'

export default ({ children }) => {
  const theme = useTheme()
  return (<Box sx={{
    paddingBlock: '6rem 2rem',
    [theme.breakpoints.down('md')]: {
      paddingBlock: '2rem 6rem',
    }
  }}>
    <Box sx={{
    paddingInline: '2rem',
    [theme.breakpoints.down('md')]: {
      paddingInline: '1rem',
    }
  }}>
    { children }
    </Box>
    <MenuBar />
  </Box>)

}
