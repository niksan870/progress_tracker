import * as React from "react";
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton } from 'react-admin';

const GraphCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="work_time" />
            <TextInput source="break_time" />
            <TextInput source="title" />
        </SimpleForm>
    </Create>
);


export default GraphCreate