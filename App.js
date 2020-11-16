import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import SkateSpots from './SkateSpots'
import SpotFormScreen from './SpotFormScreen';
import SpotFormScreen2 from './SpotFormScreen2';
import MessageScreen from './MessageScreen';
import UserList from './UserList';
import SpotList from './SpotList';

import SpotForm from './SpotForm';
import Firebase from "./config/Firebase";
// import {createSwitchNavigator} from 'react-navigation-switch'
import {createDrawerNavigator,DrawerNavigatorItems} from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer,createSwitchNavigator} from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import SafeAreaView from 'react-native-safe-area-view';

const LoginStack = createStackNavigator({
  
 
   
   
//   SpotFormScreen: SpotFormScreen,
//  SpotFormScreen2: SpotFormScreen2,
//   SpotForm: SpotForm
 Login: Login,
 SignUp: SignUp,
 


  
});

const messageStack = createStackNavigator({
  UserList: UserList,
  MessageScreen: MessageScreen,

})

const spotStack = createStackNavigator({
  SpotList:SpotList
})

const AppStack = createStackNavigator({
  
 
   
   
 
  SkateSpots: SkateSpots,
     SpotFormScreen: SpotFormScreen,
   // SpotFormScreen2: SpotFormScreen2,
    SpotForm: SpotForm
  ,
  SpotFormScreen2: SpotFormScreen2,

  
    
  });

const MyDrawerNavigator = createDrawerNavigator(
  
{
  Spots: {
    screen: AppStack,
  },
  Messages: {
    screen: messageStack,
  },
  SpotList:
  {
    screen: spotStack
  }
},
  {
    contentComponent:(props) => (
      <View style={{flex:1}}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerNavigatorItems {...props} />
            <TouchableOpacity onPress={()=>
              Alert.alert(
                'Log out',
                'Do you want to logout?',
                [
                  {text: 'Cancel', onPress: () => {return null}},
                  {text: 'Confirm', onPress: () => {
                                Firebase.auth().signOut()
                                .then(() =>  props.navigation.navigate('Login')
                                )
                            }
                  },
                ],
                { cancelable: false }
              )  
            }>
              <Text style={{margin: 16,fontWeight: 'bold'}}>Logout</Text>
            </TouchableOpacity>
          </SafeAreaView>
      </View>
    ),
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerhandClose',
    drawerToggleRoute: 'DrawerToggle'
  
});


const AppNavigator = createSwitchNavigator(
  {
    App: MyDrawerNavigator,
    Auth: {
      screen: LoginStack,
    },
  },
  {
    initialRouteName: 'Auth',
  },
);





export default createAppContainer(AppNavigator);