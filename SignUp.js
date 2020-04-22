import React from "react";
import {
  View,
  StyleSheet,
  Text
} from "react-native";
import Firebase from "./config/Firebase";
import { Input } from "./components/input";
import { Button } from "./components/Button";

class Signup extends React.Component {
  handleSignUp = () => {
    const { email, password } = this.state;
    const uuid =Math.random();
    const user={uuid: uuid, name: this.state.name, email: email}
    Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      Firebase.firestore()
      .collection('Users')
      .add(user)
      .then((snapshot)=>{
        user.id = snapshot.id;
        snapshot.set(user);
      })
    
    
      .then(() => this.props.navigation.navigate("SkateSpots"))
      .catch(error => console.log(error));
  
      
  
    };
  state = {
    name: "",
    email: "",
    password: ""
  };

  render() {
    return (
      <View>
        <Input
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          placeholder="Name"
        />
        <Input
          style={styles.inputBox}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder="Email"
          autoCapitalize="none"
        />
        <Input
          style={styles.inputBox}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder="Password"
          secureTextEntry={true}
        />
        <Button onPress={this.handleSignUp}>
          <Text>Signup</Text>
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
    flexDirection: "row"
  },
  form: {
    flex: 1
  }
});

export default Signup;
