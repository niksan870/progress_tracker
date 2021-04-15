import * as React from "react";
import { Create, Edit, SimpleForm, TextInput, DateInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton, BooleanInput } from 'react-admin';

const GoalEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled label="Id" source="id" />
            <TextInput source="name" />
            <TextInput source="body" />
            <BooleanInput source="private" />
        </SimpleForm>
    </Edit>
);
export default GoalEdit