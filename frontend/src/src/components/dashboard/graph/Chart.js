import React, { PureComponent } from 'react';
import "./Chart.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';

const Chart = (props) => {
    const goal = useSelector(state => state.currentGoal)
    const data = props.graph

    return (<LineChart
        width={500}
        height={400}
        data={data}
        margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
        }}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="time_spent" stroke="#82ca9d" />
    </LineChart>
    );
}

export default Chart;