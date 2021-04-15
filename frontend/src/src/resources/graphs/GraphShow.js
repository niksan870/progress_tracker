import * as React from "react";
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const GraphShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="data" />
            <TextField source="summed_time" />
        </SimpleShowLayout>
    </Show>
);
export default GraphShow