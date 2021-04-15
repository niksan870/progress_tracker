import React from "react";
import {
    List,
    TextField,
    ImageField,
    Filter,
    TextInput,
    EmailField,
    Datagrid,
    TopToolbar,
    CreateButton,
    ExportButton,
    sanitizeListRestProps,
    EditButton,
    DeleteButton,
    ShowButton,
} from "react-admin";
import { cloneElement } from "react";



const ListActions = ({
    currentSort,
    className,
    resource,
    filters,
    displayedFilters,
    exporter,
    filterValues,
    permanentFilter,
    hasCreate,
    basePath,
    selectedIds,
    onUnselectItems,
    showFilter,
    maxResults,
    total,
    ...rest
}) => (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {filters &&
            cloneElement(filters, {
                resource,
                showFilter,
                displayedFilters,
                filterValues,
                context: "button",
            })}
        <CreateButton basePath={basePath} />
        <ExportButton
            disabled={total === 0}
            resource={resource}
            sort={currentSort}
            filter={{ ...filterValues, ...permanentFilter }}
            exporter={exporter}
            maxResults={maxResults}
        />
    </TopToolbar>
);

ListActions.defaultProps = {
    selectedIds: [],
    onUnselectItems: () => null,
};



const JournalFilter = (props) => {
    return (
        <Filter {...props}>
            <TextInput label="Search By Name" source="search" alwaysOn />
        </Filter>
    );
};


const JournalList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}
            filters={<JournalFilter />}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="body" />
                <TextField source="updated_at" />
                <TextField source="created_at" />
                <ShowButton />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};

export default JournalList