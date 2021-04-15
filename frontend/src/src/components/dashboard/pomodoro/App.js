import React, { Component } from "react";
import Settings from "./Settings";
import Times from "./Times";
import Controller from "./Controller";
import axios from "axios";
import "./App.css";
import { showNotification } from "react-admin";
import PropTypes from "prop-types";
import { connect, useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { BASE_API_URL } from "../../../../constants";
import Chart from "../graph/Chart"


class App extends Component {
  constructor(props) {
    super(props);

    this.audioBeep = React.createRef();

    this.state = {
      breakLength: Number.parseInt(this.props.defaultBreakLength, 10),
      sessionLength: Number.parseInt(this.props.defaultSessionLength, 10),
      sessionLengthTracker:
        Number.parseInt(this.props.defaultSessionLength, 10) - 1,
      timeLabel: "Session",
      timeLeftInSecond:
        Number.parseInt(this.props.defaultSessionLength, 10) * 60,
      timeDoneSoFar: null,
      isStart: false,
      showGraph: false,
      goalData: {},
      goalId: this.props.goalId,
      goalChartId: null,
      timerInterval: null,
      dailyTimeToBeReached: null,
      counter: -1,
      graph: this.props.graph,
      minuteCounter: Number.parseInt(this.props.defaultSessionLength, 10),
      selectedGoal: null,
      token: localStorage.getItem("accessToken"),
    };

    this.onIncreaseBreak = this.onIncreaseBreak.bind(this);
    this.onDecreaseBreak = this.onDecreaseBreak.bind(this);
    this.onIncreaseSession = this.onIncreaseSession.bind(this);
    this.onDecreaseSession = this.onDecreaseSession.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onStartStop = this.onStartStop.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.submitTime = this.submitTime.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  onIncreaseBreak() {
    if (this.state.breakLength < 60 && !this.state.isStart) {
      this.setState({
        breakLength: this.state.breakLength + 1,
      });
    }
  }

  onDecreaseBreak() {
    if (this.state.breakLength > 1 && !this.state.isStart) {
      this.setState({
        breakLength: this.state.breakLength - 1,
      });
    }
  }

  onIncreaseSession() {
    if (this.state.sessionLength < 60 && !this.state.isStart) {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        timeLeftInSecond: (this.state.sessionLength + 1) * 60,
      });
    }
  }

  onDecreaseSession() {
    if (this.state.sessionLength > 1 && !this.state.isStart) {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        timeLeftInSecond: (this.state.sessionLength - 1) * 60,
      });
    }
  }

  onReset() {
    this.setState({
      breakLength: Number.parseInt(this.props.defaultBreakLength, 10),
      sessionLength: Number.parseInt(this.props.defaultSessionLength, 10),
      timeLabel: "Session",
      timeLeftInSecond:
        Number.parseInt(this.props.defaultSessionLength, 10) * 60,
      isStart: false,
      timerInterval: null,
    });

    this.audioBeep.current.pause();
    this.audioBeep.current.currentTime = 0;
    this.state.timerInterval && clearInterval(this.state.timerInterval);
  }

  submitTime() {
    this.setState({
      ...this.state,
      sessionLengthTracker: Math.ceil(this.state.timeLeftInSecond / 60 - 1),
      counter: 0,
    });
    axios({
      method: "put",
      url: BASE_API_URL + "/graph/update_graph/",
      data: {
        "type": "goals",
        "id": this.state.goalId,
        "time": 60
      },
      headers: {
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then((response) => {
        this.setState({
          ...this.state,
          graph: response.data
        });
      })
      .catch((error) => {
        this.props.showNotification("Error: something went wrong", "warning");
      });
  }

  onStartStop() {
    if (this.state.goalId) {
      if (!this.state.isStart) {
        this.setState({
          isStart: !this.state.isStart,
          timerInterval: setInterval(() => {
            this.decreaseTimer();
            this.phaseControl();
            if (
              this.state.timeLabel === "Session" &&
              this.state.timeLeftInSecond / 60 ===
              this.state.sessionLengthTracker
            ) {
              this.submitTime();
            }
          }, 50),
        });
      } else {
        this.audioBeep.current.pause();
        this.audioBeep.current.currentTime = 0;
        this.state.timerInterval && clearInterval(this.state.timerInterval);

        this.setState({
          isStart: !this.state.isStart,
          timerInterval: null,
        });
      }
    } else {
      this.props.showNotification("You have to select a goal to work on", "warning");
    }
  }

  decreaseTimer() {
    if (this.state.minuteCounter - 1 === this.state.timeLeftInSecond / 60) {
      this.setState({
        timeLeftInSecond: this.state.timeLeftInSecond - 1,
        counter: this.state.counter + 1,
        timeDoneSoFar: 60,
      });
    } else {
      this.setState({
        timeLeftInSecond: this.state.timeLeftInSecond - 1,
        counter: this.state.counter + 1,
        timeDoneSoFar:
          this.state.sessionLength * 60 - this.state.timeLeftInSecond,
      });
    }
  }

  phaseControl() {
    if (this.state.timeLeftInSecond === 0) {
      this.audioBeep.current.play();
    } else if (this.state.timeLeftInSecond === -1) {
      if (this.state.timeLabel === "Session") {
        this.setState({
          timeLabel: "Break",
          timeLeftInSecond: this.state.breakLength * 60,
        });
      } else {
        this.setState({
          timeLabel: "Session",
          timeLeftInSecond: this.state.sessionLength * 60,
          sessionLengthTracker: this.state.sessionLengthTracker == -1 ? Number.parseInt(this.props.defaultSessionLength, 10) - 1 : -1
        });
      }
    }
  }

  handleSelect(e) {
    axios({
      method: "get",
      url: BASE_API_URL + "/goalsChart/" + e.target.value.id,
      data: {},
      headers: {
        Authorization: "Bearer " + this.state.token,
      },
    })
      .then((response) => {
        let hours = parseInt(e.target.value.hours) * 3600;
        let minutes = (parseInt(e.target.value.minutes) % 3600) * 60;
        let time = hours + minutes;

        this.setState({
          ...this.state,
          goalData: JSON.parse(response.data.jsonData),
          goalChartId: response.data.id,
          selectedGoal: e.target.value,
          dailyTimeToBeReached: time,
          breakLength: Number.parseInt(this.props.defaultBreakLength, 10),
          sessionLength: Number.parseInt(this.props.defaultSessionLength, 10),
          timeLabel: "Session",
          timeLeftInSecond:
            Number.parseInt(this.props.defaultSessionLength, 10) * 60,
          isStart: false,
          timerInterval: null,
          showGraph: true,
        });
      })
      .catch((error) => {
        this.props.showNotification("Error: comment not approved", "warning");
      });
  }

  componentWillReceiveProps(props) {
    this.setState({
      breakLength: Number.parseInt(props.defaultBreakLength, 10),
      sessionLength: Number.parseInt(props.defaultSessionLength, 10),
      timeLeftInSecond: Number.parseInt(props.defaultSessionLength, 10) * 60,
    });
  }

  render() {
    const graph = !this.state.graph ? this.props.graph : this.state.graph;
    return (
      <div>
        <div className="pomodoro-clock">
          {/* <Settings
            breakLength={this.state.breakLength}
            sessionLength={this.state.sessionLength}
            isStart={this.state.isStart}
            onDecreaseBreak={this.onDecreaseBreak}
            onDecreaseSession={this.onDecreaseSession}
            onIncreaseBreak={this.onIncreaseBreak}
            onIncreaseSession={this.onIncreaseSession}
          /> */}
          <Times
            timeLabel={this.state.timeLabel}
            timeLeftInSecond={this.state.timeLeftInSecond}
          />
          <Controller
            onReset={this.onReset}
            onStartStop={this.onStartStop}
            isStart={this.state.isStart}
          />
          <audio
            id="beep"
            preload="auto"
            src="http://www.soundjay.com/button/beep-07.wav"
            ref={this.audioBeep}
          ></audio>
        </div>
        <Grid
          style={{ backgroundColor: "white" }}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          {this.props.graph ? <Chart graph={graph} /> : null}
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  record: PropTypes.object,
  state: PropTypes.object,
  showNotification: PropTypes.func,
};

const mapStateToProps = state => ({
  graph: state.currentGraph
});

export default connect(mapStateToProps, {
  showNotification,
})(App);
