import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { Query, Loading } from "react-admin";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(11),
        height: theme.spacing(11),
    },
}));


export const ArrayFieldGenericButton = ({ source, record, type = "show" }) => {
    const classes = useStyles();
    return <Button
        component={Link}
        className={classes.small}
        to={{ pathname: `/goals/${record.id}/${type}` }}
    >
        {type}
    </Button>
};
