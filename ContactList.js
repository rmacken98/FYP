import React from "./node_modules/react";
import {Text, Image,Platform, KeyboardAvoidingView, SafeAreaView,StyleSheet,FlatList} from "react-native";
import {GiftedChat} from './node_modules/react-native-gifted-chat';
import {send, getMessages} from './SkateSpotsApi';
import Firebase from "./config/Firebase";

export default class ContactList extends React.Component {
 
    static navigationOptions = ({navigation}) => {


        
       
       

        return {
           headerLeft: <Text 
onPress={() =>  this.props.navigation.navigate("Skatespots")}
  >Menu</Text>,
            
        }}
    state = {
        messages: [



        ],
        message:{},
        Users:["Ronan","David","Ciaran","John"]
    }
    

  

    renderItem = ({ item }) => {
        return <UserItem item={item} />;
    };

    render() {
        return (
            <FlatList
                data={this.Users}
                renderItem={this.renderItem}
                keyExtractor={item => item.login.uuid}
            />
        );
    }}