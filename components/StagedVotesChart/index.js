import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import {
	BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import cfpConfig from '../../cfp.config'
import { useTheme } from '@emotion/react';

const StagedVotesChart = ( { data, stage } ) => {
  const theme = useTheme()
  const wrapper = useRef(null)
  const [ size, setSize ] = useState({
    width: 600,
    height: 400
  })

  const onResize = () => {
    setSize({
      width: wrapper.current.clientWidth,
      height: wrapper.current.clientHeight,
    })
  }

  useEffect(() => {
    setSize({
			width: wrapper.current.clientWidth,
			height: wrapper.current.clientHeight,
		})

    if (window) {
      window.addEventListener('resize',onResize)
    }

    return () => {
      window.removeEventListener('resize',onResize)
    }
  }, [wrapper.current])


  const { width, height } = size

  const displayedData = data.map(( { votes }, i ) => {
    const item = Object.assign({}, {
      votes,
      index: `${i + 1}`,
      name: `Vote No.#${i + 1}`
    })
    return item
  })


  return (
    <Box sx={{
      width: '100%',
      height: 400,
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: `wrap`,
      paddingTop: 8 * theme.spacing.unit
    } } ref={ wrapper }  >
      <BarChart
        width={ width }
        height={ height }
        barCategoryGap={ '5%' }
        data={ displayedData }
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        {/* <Legend content={() => cfpConfig.votingStages[stage].label } /> */}
        <Bar dataKey="votes" fill="#673ab7" label={ (d) => {
          return 'asd'
        }} />
      </BarChart>
    </Box>
  );
}

export default StagedVotesChart
