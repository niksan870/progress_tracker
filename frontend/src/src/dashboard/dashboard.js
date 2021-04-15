import * as React from "react";
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TabPanel from "../components/dashboard/table/TablePanel"
import GraphTablePanel from "../components/dashboard/table/GraphTablePanel"
import { Query, Loading, Error, showNotification, GET_LIST, useDataProvider, withDataProvider, useQueryWithStore } from "react-admin";
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Dashboard(props) {
    return (
        <Container maxWidth="lg">
            <TabPanel  {...props} />
        </Container>
    )
}

Dashboard.propTypes = {
    dataProvider: PropTypes.func.isRequired,
    dispatch: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
};


export default withDataProvider(Dashboard)