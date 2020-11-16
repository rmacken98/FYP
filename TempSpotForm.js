import React, { Component } from './node_modules/react';
import SpotForm from './SpotForm';
import { Input } from './components/input';

export default class TempSpotForm extends Component {

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

    if (currentSpot) {
      this.setState(prevState => ({ spot: prevState.spot = currentSpot }))
      this.setState(prevState => ({ spot: prevState.spot = longitude }))
      this.setState(prevState => ({ spot: prevState.spot = latitude }))

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