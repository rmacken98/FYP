import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Login from "../Login";
import SignUp from "../SignUp";
import Profile from "../Profile";

const SwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: Login
    },
    Signup: {
      screen: SignUp
    },
    Profile: {
      screen: Profile
    }
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(SwitchNavigator);
