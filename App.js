import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import SkateSpots from './SkateSpots'
import SpotFormScreen from './SpotFormScreen';
import SpotFormScreen2 from './SpotFormScreen2';


import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import {
  View,
  Text,
  StyleSheet
} from "react-native";

const AppStack = createStackNavigator({
  
  Login: Login,
  SignUp: SignUp,
  SkateSpots: SkateSpots,
  SpotFormScreen: SpotFormScreen,
  SpotFormScreen2: SpotFormScreen2,


  
});

export default createAppContainer(AppStack);