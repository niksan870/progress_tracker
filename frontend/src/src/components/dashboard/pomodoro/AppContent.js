import React, { Component, useState } from "react";
import App from "./App";
import Grid from "@material-ui/core/Grid";
import { useSelector, useDispatch } from 'react-redux';
import { useNotify, useRedirect, fetchStart, fetchEnd, Button } from 'react-admin';
import { BASE_API_URL } from "../../../../constants";
import axios from "axios";
import { setCurrentGraph } from "../../../redux/actions/setCurrentGraph"


const AppContent = () => {
  const dispatch = useDispatch();
  const currentPomodoro = useSelector(state => state.currentPomodoro)
  const goal = useSelector(state => state.currentGoal)
  const graph = useSelector(state => state.currentGraph)

  const break_time = currentPomodoro ? currentPomodoro.break_time : 5;
  const work_time = currentPomodoro ? currentPomodoro.work_time : 25;
  const token = localStorage.getItem("accessToken")

  axios({
    method: "post",
    url: BASE_API_URL + "/graph/get_users_graph/",
    data: {
      "type": "goals",
      "id": 1,
    },
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      if (!graph) {
        dispatch(setCurrentGraph(response.data))
      }
    })
    .catch((error) => {
      console.log(error)
    });

  return (
    <div>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          id="dashboard"
          style={{ textAlign: "center" }}
        >
          <App
            defaultBreakLength={break_time}
            defaultSessionLength={work_time}
            goalId={goal.id}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default AppContent