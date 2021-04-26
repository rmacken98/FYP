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

class Signup extends React.Component {
  handleSignUp = () => {
    const { email, password,uuid } = this.state;
   
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(cred =>{

        this.setState(prevState => ({
         uuid:cred.user.uid
        }))
        console.log(cred.user.uid)
        const user={uuid:cred.user.uid, name: this.state.name, email: email}

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
    location:""
  };

  render() {
    return (
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

{/* <Picker
                 selectedValue={this.state.filter}
                     style={{ height: 50, width: 150 }}
                     onValueChange={this.filter}
                                              

                         
                         >
 
  <Picker.Item label="Dublin" value="Dublin" />
  <Picker.Item label="Drogheda" value="Drogheda" />
  <Picker.Item label="Dundalk" value="Dundalk" /> 

 </Picker> */}

        <Button title="Sign Up"onPress={this.handleSignUp}>
         
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  form: {
    flex: 1
  },
  imageContainer: {
    width: '100%',
    height: 200
  },
});

export default Signup;
