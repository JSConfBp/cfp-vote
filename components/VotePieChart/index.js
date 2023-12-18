
import React from 'react'
import Typography from '@mui/material/Typography';
import cfpConfig from '../../cfp.config'

import {
	PieChart, Pie, ResponsiveContainer, Cell
} from 'recharts';

const VotePieChart = ({ classes, data, stage } ) => {

  return <>
  <Typography variant='h5'>{ cfpConfig.votingStages[stage].label }</Typography>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart width={730} height={250}>
      <Pie data={data} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={80} label={(p) => {
        return `${p.label} ${Math.round((p.percent * 10) * 100) / 10}%`
      }} animationDuration={800}>
        {
          data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(261.6deg 51.87% ${47.25 + index * 10}%)`} />
          ))
        }
      </Pie>
    </PieChart>
  </ResponsiveContainer>
</>
}


export default VotePieChart
