import * as React from "react";
import { Show, SimpleShowLayout, TextField, ReferenceManyField, ReferenceField, Datagrid, DateField, TabbedShowLayout, Tab, ChipField, SingleFieldList, ReferenceArrayField, ArrayField, UrlField, ShowButton } from 'react-admin';
import { JsonField, JsonInput } from "react-admin-json-view";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { ArrayFieldGenericButton } from "../../buttons/ArrayFieldGenericButton";

const UserProfileShow = (props) => (
    <Show {...props}>
        <TabbedShowLayout>
            <Tab label="summary">
                <TextField source="id" />
                <TextField source="location" />
            </Tab>
            <Tab label="goals">
                <ArrayField source="goals" fieldKey="id">
                    <Datagrid>
                        <TextField source="id" />
                        <TextField source="name" />
                        <TextField source="body" />
                        <TextField source="private" />
                        <ArrayFieldGenericButton type="show" />
                    </Datagrid>
                </ArrayField>
            </Tab>
            <Tab label="graph">
                <ReferenceField label="Graph" source="graph_id" reference="graph">
                    <TextField label="Graph" source="id" />
                </ReferenceField>
            </Tab>
            <Tab label="journals">
                <ReferenceField label="Journals" source="journal_id" reference="journal">
                    <TextField label="Journal" source="id" />
                </ReferenceField>
            </Tab>
        </TabbedShowLayout>
    </Show>
);
export default UserProfileShow