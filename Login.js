import React from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import Firebase from "./config/Firebase";
import { Input } from "./components/input";
import { Button } from "./components/Button";
// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
//import SignUp from './SignUp';
class Login extends React.Component {
   
      _SignUp = () => {
        this.props.navigation.navigate('SignUp');
       
      };

  handleLogin = () => {
    const { email, password } = this

    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("SkateSpots"))
      .catch(error => console.log(error));
  };
  state = {
    email: "",
    password: ""
  };



  render() {
    return (
     
      <View style={styles.form}>
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
        <Button onPress={this.handleLogin}>
          <Text>Login</Text>
        </Button>
        <Button
         onPress={this._SignUp}
        ><Text>Don't have an account yet? Sign up</Text>
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

export default Login;
