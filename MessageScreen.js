import React from "./node_modules/react";
import {Text, Image,Platform, KeyboardAvoidingView, SafeAreaView,StyleSheet} from "react-native";
import {GiftedChat} from './node_modules/react-native-gifted-chat';
import {send, getMessages,getMyMessages} from './SkateSpotsApi';
import Firebase from "./config/Firebase";

export default class MessageScreen extends React.Component {
 
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
        userto:{}
    }
    

  
    onMessageRecieved = (messages)=>{
        // console.log(coordinates);
          this.setState(prevState => ({
              messages: prevState.messages = messages
              
          }));

         // console.log(messages)

      
      }
    
        
      
    //   onMessageAdded = (message) => {
    //     this.setState(prevState => ({
    //         messages: GiftedChat.append(prevState.messages, message)
    //     }))}
    onSend(messages = []) {
        
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))



    }
   chatID = () => {
  const chatterID = Firebase.auth().currentUser.uid
  const chateeID = this.state.userto.user.uuid;
  const chatIDpre = [];
  chatIDpre.push(chatterID);
  chatIDpre.push(chateeID);
  chatIDpre.sort();
  return chatIDpre.join('_')
};

// export const sendChatMessage = (chatID, chat) => {
//   return db
//     .collection('messages')
//     .doc(chatID)
//     .collection('chats')
//     .add(chat);
// };

    get user() {
      return {
        name: Firebase.auth().currentUser.email,
        _id: Firebase.auth().currentUser.uid,
      };
    }

    send  =(messages) => {
        let time;
        const chatterID = Firebase.auth().currentUser.uid
        const chateeID = this.state.userto.uuid;
        const chatIDpre = [];
        chatIDpre.push(chatterID);
        chatIDpre.push(chateeID);
        chatIDpre.sort();
       var c = chatIDpre.join('_')
        console.log(c);
        // Create a new date from the passed date time
            var hours = new Date().getHours();
      
        // Hours part from the timestamp
        // var hours = date.getHours();
        
        // Minutes part from the timestamp
        var minutes = new Date().getMinutes();
      
        time = hours + ':' + minutes;
        messages.forEach(item => {
         
          const message = {
            chatID: c,
            _id: Math.random(),
            text: item.text,
            createdAt: new Date().toString(),
            user: item.user
          };
         Firebase.firestore().collection('Messages').add(message);
        
      
        })
      }
  
 
      combinesend(messages){
          this.send(messages);
          this.onSend(messages);

      }

      listAllUsers(nextPageToken) {
        // List batch of users, 1000 at a time.
        admin.auth().listUsers(1000, nextPageToken)
          .then(function(listUsersResult) {
            listUsersResult.users.forEach(function(userRecord) {
             // console.log('user', userRecord.toJSON());
            });
            if (listUsersResult.pageToken) {
              // List next batch of users.
              listAllUsers(listUsersResult.pageToken);
            }
          })
          .catch(function(error) {
         //   console.log('Error listing users:', error);

          });
      }
  
    componentDidMount(){
        const Chatee = this.props.navigation.getParam('userto');
      this.setState(prevState => ({ userto: prevState.userto = Chatee }))

      const chatterID = Firebase.auth().currentUser.uid
      const chateeID = Chatee.uuid;
      const chatIDpre = [];
      chatIDpre.push(chatterID);
      chatIDpre.push(chateeID);
      chatIDpre.sort();
     var c = chatIDpre.join('_')
    
      

      getMyMessages(this.onMessageRecieved,c);
       
     

          }
 



 
    render(){
      // console.log(Firebase.auth().currentUser.displayName)
      //   console.log(this.listAllUsers)
        const chat = <GiftedChat   messages= {this.state.messages} onSend={message=>this.combinesend(message)} user = {this.user} showUserAvatar={true}></GiftedChat>
        return (
        <SafeAreaView style = {{flex :1}}>{chat}</SafeAreaView>
    );
        }

}
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
    ...StyleSheet.absoluteFillObject
  },
    carousel:{
      position: 'absolute',
      bottom: 0,
      marginBottom: 48,

    },
    cardContainer:{
        backgroundColor: 'rgba(0, 0,0, 0.6)',
        height:200,
        width:300,
        padding:24,
        borderRadius: 24
    },
    cardImage: {
        height: 120,
        width:300,
        bottom: 0,
        position:'absolute',
        borderBottomLeftRadius:24,
        borderBottomRightRadius:24,

    },
    cardTitle: {
        color: 'white',
        fontSize : 22,
        alignSelf : 'center'
    },
    forcard:{
		backgroundColor:'rgba(56, 172, 236, 1)',
		borderWidth:0,
		borderRadius:20
    },
    time:{
		fontSize:38,
		color:'#fff'
	},
	notes: {
		fontSize: 18,
		color:'#fff',
		textTransform:'capitalize'
    },
    form: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
      },
  });