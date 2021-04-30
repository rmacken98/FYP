import React, { Component } from 'react';
import SpotForm from './SpotForm';

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
    console.log(currentSpot);
    const longitude = this.props.navigation.getParam('longitude');
    const latitude = this.props.navigation.getParam('longitude');

    
    if (currentSpot){
     
      this.setState(prevState => ({ spot: prevState.spot = currentSpot }))
    }
    
  }

  onSpotUpdated = (spot) => {
    console.log(spot);
    this.props.navigation.popToTop();
  }



  render() {
    console.log(this.props.navigation.getParam('longitude'))
    return (
  
      <SpotForm
      setLongitude={this.state.spot.longitude}
      setLatitude={this.state.spot.latitude}
      
      
        spot={this.state.spot}
        onSpotAdded={this.props.navigation.getParam('spotAddedCallback')}
        onSpotUpdated={this.onSpotUpdated}
      />
    );
  }
}