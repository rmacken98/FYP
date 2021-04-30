import React from "./node_modules/react";
import {
  View,
  Text,
  StyleSheet,
  Image,
Alert
  
} from "react-native";
import Firebase from "./config/Firebase";
import { Input } from "./components/input";
import { Button } from "./components/Button";

class Login extends React.Component {

      _SignUp = () => {
        this.props.navigation.navigate('SignUp');
      };

  handleLogin = () => {
    const { email, password } = this.state;

    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate("SkateSpots"))
      .catch(error =>   Alert.alert(
        "Error",
        "Text field is empty or Email format is invalid",
        [
         
          { text: "OK", onPress: () => console.log(error) }
        ]
      ));
  };
  state = {
    email: "",
    password: ""
  };



  render() {
    return (
      


      <View style={styles.container}>
         <Image  style= {styles.imageContainer}source={require('./images/Untitled-8.png')}></Image>
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
        <Button onPress={this.handleLogin} title="Login"/>
          
        <Button
         onPress={this._SignUp}
         title="Don't have an account yet?"
         subTitle="Sign up"
        />

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

export default Login;