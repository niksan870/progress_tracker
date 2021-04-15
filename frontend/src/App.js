import React from "react";
import { createHashHistory } from "history";
import Dashboard from './src/dashboard/dashboard';
import authProvider from "./src/providers/authProvider";
import { BASE_API_URL } from "./constants";
import { fetchUtils, Admin, Resource } from "react-admin";
import provider from "./src/providers/dataProvider";
import { Provider } from "react-redux";
import addUploadFeature from "./src/providers/addUploadFeature";
import store from "./src/store";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { englishMessages } from "./src/translate/translate";
import { GET_ONE, UPDATE } from "react-admin";
import LoginPage from "./src/components/register/App";
import setCurrentGoal from './src/redux/reducers/setCurrentGoal';
import setCurrentPomodoro from './src/redux/reducers/setCurrentPomodoro';

import pomodoros from './src/resources/pomodoros';
import user_profiles from './src/resources/user_profiles';
import graphs from './src/resources/graphs';
import goals from './src/resources/goals';
import journals from './src/resources/journals';


const handleUserProfile = dataProvider => (verb, resource, params) => {
  if (resource === "profile") {
    if (verb === GET_ONE) {
      let storedProfile = localStorage.getItem("my-profile");

      if (storedProfile) {
        return Promise.resolve({
          data: JSON.parse(storedProfile),
        });
      }


      return Promise.resolve(
        httpClient(`${BASE_API_URL}/profiles/me`, {
          method: "GET",
        })
      ).then((response) => {
        response.json["id"] = "my-profile";
        console.log(response.json)
        localStorage.setItem("my-profile", JSON.stringify(response.json));
        return ({
          data: response.json,
        })
      });
    }

    if (verb === UPDATE) {
      localStorage.setItem("profile", JSON.stringify(params.data));
      return Promise.resolve({ data: params.data });
    }
  }

  // Fallback to the dataProvider default handling for all other resources
  return dataProvider(verb, resource, params);
};

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("accessToken");
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = provider(BASE_API_URL, httpClient);
const uploadCapableDataProvider = addUploadFeature(dataProvider);
const testProvider = handleUserProfile(
  uploadCapableDataProvider
);

const history = createHashHistory();
const i18nProvider = polyglotI18nProvider((locale) => englishMessages);

const App = () => {
  return (
    <Provider
      store={store({
        authProvider,
        testProvider,
        history,
      })}
    >
      <Admin
        locale="en"
        customReducers={{ currentGoal: setCurrentGoal, currentPomodoro: setCurrentPomodoro }}
        loginPage={LoginPage}
        authProvider={authProvider}
        dataProvider={testProvider}
        i18nProvider={i18nProvider}
        history={history}
        dashboard={Dashboard}
      >

        <Resource name="user_profiles" {...user_profiles} />
        <Resource name="pomodoros" {...pomodoros} />
        <Resource name="graph" {...graphs} />
        <Resource name="goals" {...goals} />
        <Resource name="journals" {...journals} />
      </Admin>
    </Provider>
  );
};



export default App;
