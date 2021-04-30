import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import SkateSpots from './SkateSpots'
import SpotFormScreen from './SpotFormScreen';
import EditScreen from './EditScreen';
import MessageScreen from './MessageScreen';
import UserList from './UserList';
import SpotList from './SpotList';
import Sensors from './Sensors';
import SpotForm from './SpotForm';
import TrackProgress from './TrickProgress';
import Firebase from "./config/Firebase";
import {createDrawerNavigator,DrawerNavigatorItems} from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer,createSwitchNavigator} from 'react-navigation';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from "react-native";
import SafeAreaView from 'react-native-safe-area-view';
import EditForm from './EditForm';

const LoginStack = createStackNavigator({
  
 
   
   

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
const dataStack = createStackNavigator({
  Sensors:Sensors
})
const trackStack= createStackNavigator({
  TrackProgress:TrackProgress
})
const AppStack = createStackNavigator({
  
 
   
   
 
  SkateSpots: SkateSpots,
     SpotFormScreen: SpotFormScreen,
   EditScreen: EditScreen,
    SpotForm: SpotForm,
    EditForm: EditForm
  ,
 

  
    
  });

const MyDrawerNavigator = createDrawerNavigator(
  
{
  Spots: {
    screen: AppStack,
  },
  Messages: {
    screen: messageStack,
  },
 
  RecordTricks: {
    screen: dataStack
  },
  TrackProgress:{
    screen: trackStack
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