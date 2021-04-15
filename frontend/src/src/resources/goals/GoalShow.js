import * as React from "react";
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const GoalShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="body" />
            <TextField source="private" />
        </SimpleShowLayout>
    </Show>
);
export default GoalShow