import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import  EditForm from './EditForm';
import {Button} from './components/Button';

export default class EditScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('spot') ? 'Edit Spot' : 'Edit Spot'
    }
  };

 

 
  state = {
    spot: {
      name: '',
        longitude: 0,
      latitude: 0
    },
    currentSubIngredient: null,
  }

  componentDidMount() {
    const currentSpot = this.props.navigation.getParam('spot');
    const longitude = this.props.navigation.getParam('longitude');
    const latitude = this.props.navigation.getParam('longitude');

    
     
      this.setState(prevState => ({ spot: prevState.spot = currentSpot }))
     
    
  }

  onSpotUpdated = (spot) => {
    console.log(spot);
    this.props.navigation.popToTop();
  }



  render() {
   
    return (
  <View>
      <EditForm
      setLongitude={this.state.spot.longitude}
      setLatitude={this.state.spot.latitude}
      
      
        spot={this.state.spot}
        onSpotAdded={this.props.navigation.getParam('spotAddedCallback')}
        onSpotUpdated={this.onSpotUpdated}
        // return = {this.props.navigation.navigate('SkateSpots')}
      />

</View>
    );
  }
}