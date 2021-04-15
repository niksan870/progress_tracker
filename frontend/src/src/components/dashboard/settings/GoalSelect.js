import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-admin';
import { setCurrentGoal } from "../../../redux/actions/setCurrentGoal"


const GoalsSelect = () => {
    const dispatch = useDispatch();
    const goal = useSelector(state => state.currentGoal)

    const [state, setState] = React.useState({
        age: '',
        name: goal ? goal.name : "",
    });
    const { data, loading, error } = useQuery({
        type: 'getList',
        resource: 'goals',
        payload: { pagination: { page: 1, perPage: 10 }, sort: { field: "a-z", order: "ABC" }, filter: {} }
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };

    return <Grid container spacing={1}>
        <Grid item xs={6}>
            <Container style={{ textAlign: "center" }}>
                <FormControl style={{ minWidth: 240 }}>
                    <InputLabel id="select-a-goal">
                        Choose a goal setting
                    </InputLabel>
                    <Select
                        label="Choose a goal setting"
                        name="goal"
                        id="goal"
                        onChange={(e) => {
                            let selected_goal = data.filter(function (goal) {
                                return goal.name == e.target.value;
                            })[0];
                            dispatch(setCurrentGoal(selected_goal))
                            handleChange(e)
                        }}
                        className="form-control"
                        value={state.name}
                        inputProps={{
                            name: 'name',
                            // id: 'goal_select',
                        }}
                    >
                        {data != null
                            ? data.map((option, index) => (
                                <MenuItem key={index} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))
                            : <MenuItem value="123">
                                <em>None</em>
                            </MenuItem>}
                    </Select>
                </FormControl>
            </Container>
        </Grid>
    </Grid >
}

export default GoalsSelect;