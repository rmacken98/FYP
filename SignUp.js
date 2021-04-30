import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Picker
} from "react-native";
import Firebase from "./config/Firebase";
import { Input } from "./components/input";
import { Button } from "./components/Button";
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from "react-native-gesture-handler";

class Signup extends React.Component {
  handleSignUp = () => {
    const { email, password,uuid, name, city } = this.state;
   
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(cred =>{

        this.setState(prevState => ({
         uuid:cred.user.uid
        }))
        console.log(cred.user.uid)
        const user={uuid:cred.user.uid, name: name , email: email, city:city}

       return Firebase.firestore()
        .collection('Users')
        .add(user)
        .then((snapshot)=>{
          user.id = snapshot.id;
          snapshot.set(user);
        })
        .catch(error => console.log(error)) 
        
      }
      )



     
      .then(() => this.props.navigation.navigate("SkateSpots"))



     
      
  
      
  
    };
  state = {
    uuid:"",
    name: "",
    email: "",
    password: "",
    location:"",
    city:""
    ,
    cities: [
      { label: "Dublin", value: "Dublin" },
      { label: "Dundalk", value: "Dundalk" },
      { label: "Drogheda", value: "Drogheda" },
    ],
  };

  render() {
    return (
      <ScrollView style={styles.containerStyle} >
        <View style={styles.container}>
         <Image  style= {styles.imageContainer}source={require('./images/Untitled-8.png')}></Image>
        <Input
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          placeholder="Name"
        />
        <Input
        
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder="Email"
          autoCapitalize="none"
        />
        <Input
       
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder="Password"
          secureTextEntry={true}
        />

<DropDownPicker
          placeholder="Select a City"
            items={this.state.cities}
            multiple={false}
            min={0}
            max={10}
            style={styles.picker}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            onChangeItem={(item) =>
              this.setState({
                city: item.value,               
              })
            }
            containerStyle={{ width: 200, height: 70 }}
            dropDownStyle={{ marginTop: 2 }}
          />

        <Button title="Sign Up"onPress={this.handleSignUp}>
         
        </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  form: {
    flex: 1
  },
  picker:{
    alignSelf:'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,},
  imageContainer: {
    width: '100%',
    height: 200
  },
});

export default Signup;
