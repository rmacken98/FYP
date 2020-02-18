import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import SkateSpots from './SkateSpots'
import SpotFormScreen from './SpotFormScreen';

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import {
  View,
  Text,
  StyleSheet
} from "react-native";

const AppStack = createStackNavigator({
  SkateSpots: SkateSpots,
  Login: Login,
  SignUp: SignUp,
  SpotFormScreen: SpotFormScreen
  
});

export default createAppContainer(AppStack);