import React, { Component } from './node_modules/react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';
import SpotForm from '../SpotForm';
import {Button} from '../components/Button';

export default class SpotFormScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('spot') ? 'Edit Spot' : 'New Spot'
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

    
    
     
    
  }

  onSpotUpdated = (spot) => {
    console.log(spot);
    this.props.navigation.popToTop();
  }



  render() {
    console.log(this.props.navigation.getParam('longitude'))
    return (
  <View>
      <SpotForm
      setLongitude={this.state.spot.longitude}
      setLatitude={this.state.spot.latitude}
      
      
        spot={this.state.spot}
        onSpotAdded={this.props.navigation.getParam('spotAddedCallback')}
        onSpotUpdated={this.onSpotUpdated}
        // return = {this.props.navigation.navigate('SkateSpots')}
      />
      <Button
onPress={() => this.props.navigation.navigate('SkateSpots')}
>
<Text>Return</Text>
</Button>
</View>
    );
  }
}