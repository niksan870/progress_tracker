import * as React from "react";
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const JournalShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <TextField source="updated_at" />
            <TextField source="created_at" />
        </SimpleShowLayout>
    </Show>
);
export default JournalShow