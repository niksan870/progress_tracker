import * as React from "react";
import { Edit, SimpleForm, TextInput } from 'react-admin';

const PomodoroEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput disabled label="Id" source="id" />
            <TextInput source="title" />
            <TextInput source="work_time" />
            <TextInput source="break_time" />
        </SimpleForm>
    </Edit>
);
export default PomodoroEdit