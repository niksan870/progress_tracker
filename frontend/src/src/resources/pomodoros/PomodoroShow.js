import * as React from "react";
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const PomodoroShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="work_time" />
            <TextField source="break_time" />
        </SimpleShowLayout>
    </Show>
);
export default PomodoroShow