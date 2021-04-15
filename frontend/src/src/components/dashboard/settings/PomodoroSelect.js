import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-admin';
import { setCurrentPomodoro } from "../../../redux/actions/setCurrentPomodoro"


const PomodoroSelect = (props) => {
    const dispatch = useDispatch();
    const pomodoro = useSelector(state => state.currentPomodoro)

    const [state, setState] = React.useState({
        age: '',
        name: pomodoro ? pomodoro.title : "",
    });
    const { data, loading, error } = useQuery({
        type: 'getList',
        resource: 'pomodoros',
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
                        Choose a pomodoro setting
                    </InputLabel>
                    <Select
                        label="Choose a pomodoro setting"
                        name="pomodoro"
                        id="pomodoro"
                        onChange={e => {
                            let selected_pomodoro = data.filter(function (pomodoro) {
                                return pomodoro.title == e.target.value;
                            })[0];
                            dispatch(setCurrentPomodoro(selected_pomodoro))
                            handleChange(e)
                        }}
                        className="form-control"
                        value={state.name}
                        inputProps={{
                            name: 'name',
                            // id: 'pomodoro_select',
                        }}
                    >
                        {data != null
                            ? data.map((option, index) => (
                                <MenuItem key={index} value={option.title}>
                                    {option.title}
                                </MenuItem>
                            ))
                            : <MenuItem value="">
                                <em>None</em>
                            </MenuItem>}
                    </Select>
                </FormControl>
            </Container>
        </Grid>
    </Grid>
}
export default PomodoroSelect