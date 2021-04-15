import React, { Component } from "react";
import axios from "axios";
import BASE_API_AUTH_URL from "../../../constants";

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      registrationErrors: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    const { email, password, username } = this.state;

    axios
      .post(`${BASE_API_AUTH_URL}/users/`, {
        username: username,
        password: password,
        email: email,
      })
      .then((response) => {
        if (response.status === 201) {
          console.log("created");
          this.props.history.push("/login");
        }
      })
      .catch((error) => {
        console.log("registration error", error);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="username"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}
