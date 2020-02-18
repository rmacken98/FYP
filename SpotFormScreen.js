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

  setLongitude = (text) => {
      text= this.props.navigation.getParam('Longitude').toString()
    props.setFieldValue('name', text)
  }

//   submitSubIngredients = () => {
//     let ingredient = this.state.currentSubIngredient;

//     if (ingredient && ingredient.length > 2) {
//       this.setState(prevState => ({
//         spot: { ...prevState.spot, subIngredients: [...prevState.spot.subIngredients, ingredient] },
//       }))
//     }
//   }

  render() {
    return (
      <SpotForm
      setLongitude={this.setLongitude}
        
        spot={this.state.spot}
        onSpotAdded={this.props.navigation.getParam('spotAddedCallback')}
        onSpotUpdated={this.onSpotUpdated}
      />
    );
  }
}