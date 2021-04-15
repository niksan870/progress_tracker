import React from "react";
import {
    List,
    TextField,
    Filter,
    TextInput,
    Datagrid,
    TopToolbar,
    CreateButton,
    ExportButton,
    sanitizeListRestProps,
    ShowButton
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



const UserProfileFilter = (props) => {
    return (
        <Filter {...props}>
            <TextInput label="Search By Name" source="search" alwaysOn />
        </Filter>
    );
};


const UserProfileList = (props) => {
    return (
        <List {...props} bulkActionButtons={false}
            filters={<UserProfileFilter />}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="location" />
                <ShowButton />
            </Datagrid>
        </List>
    );
};

export default UserProfileList