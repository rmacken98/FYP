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

    if (currentSpot) {
      this.setState(prevState => ({ spot: prevState.spot = currentSpot }))
    }
  }

  onSpotUpdated = (spot) => {
    console.log(spot);
    this.props.navigation.popToTop();
  }

//   setLongitude = () => {
//     this.setState({longitude:'20'})
  
// }

  
  onFieldChange = () => value => {
    value='hello'
    form.setFieldValue(property, value);
    form.setFieldTouched(property);
    form.setFieldError(property, null);
  };



  render() {
    console.log(this.props.navigation.getParam('longitude'))
    return (
      <SpotForm
      setLongitude={this.props.navigation.getParam('longitude').toString()}
      setLatitude={this.props.navigation.getParam('latitude').toString()}
      
      
        spot={this.state.spot}
        onSpotAdded={this.props.navigation.getParam('spotAddedCallback')}
        onSpotUpdated={this.onSpotUpdated}
      />
    );
  }
}