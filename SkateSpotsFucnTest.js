import React, { useContext } from './node_modules/react';
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';
import {getSpots, getMySpots} from './SkateSpotsApi';

import { SpotContext } from './SpotProvider';

const ThirdComponent = () => {

  // async componentDidMount() {
  //   console.log("componentDidMount");
  //   const result = await fetch('https://api.openbrewerydb.org/breweries/5494')
  //   const brewery = await result.json()
  //   console.log(brewery.name);
  // }

  const spot = useContext(SpotContext);
  const renderModal = (e) =>{
    

    // this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, 
    // longitude:  e.nativeEvent.coordinate.longitude}]})


    //with this it would be
    spot.setNewMarkers([...NewMarkers,{name:'test',latitude:  e.nativeEvent.coordinate.latitude, 
    longitude:  e.nativeEvent.coordinate.longitude}])



    // this.props.navigation.navigate("SpotFormScreen", {spot: {name:'',longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude},longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude}
    //     )
   
   
    
}









 

  return (
    <View style={styles.container}>

    <MapView
         provider={PROVIDER_GOOGLE}
         ref={map => this._map = map}
         showsUserLocation={true}
         style={styles.map}
        // initialRegion={this.state.initialPosition}
        initialRegion={spot.initialPosition}
         onLongPress={renderModal}
         // onLongPress= {(e) => {
             
             
         //     this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, longitude:  e.nativeEvent.coordinate.longitude}]})
            
         // }
         // }
         
     ><View>
         <Button title='View My Spots'
         style= {styles.forcard}
          onPress={()=> getMySpots(this.onSpotsRecieved)}></Button>
          <View>
          <Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
          {/* <Button title='View All Spots'
 style= {styles.forcard}
         onPress={()=> getSpots(this.onSpotsRecieved)}>
         </Button> */}
          </View>
          
     </View>
        {
         this.state.newMarkers.map((marker, index) => (
             <Marker
             key= {marker.name}
             onPress = { ()=> this.renderOptions(marker,index)}
             coordinate= {{latitude: marker.latitude, longitude:marker.longitude}}
            
             title = {marker.name}>
           

             </Marker>
         ))
     }
     
     {}
     
     {
         // this.state.coordinates.map((marker, index) => (
             spot.coordinates.map((marker, index) => (
             <Marker
             key= {marker.name}
           //  ref= {ref => this.state.markers[index] = ref}
           ref= {ref => spot.markers[index] = ref}
             onPress = {   ()=> this.renderOptions(marker,index)}
         
             coordinate= {{latitude: marker.latitude, longitude:marker.longitude}}
             // onLongPress= {()=> this.props.navigation.navigate("Login")}
            
             title = {marker.name}>
             {/* <Image style={{width: 46, height: 38}} source={require('./images/icons8-skateboard-50.png')}></Image> */}
               <Callout 
                
               tooltip={true}>
               <Card containerStyle={styles.forcard}>
             <Text style={styles.notes}>{spot.location}</Text>
             
             <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
             <Image style={{width:100, height:100}} source={{uri:"https://openweathermap.org/img/w/" + spot.weather.icon + ".png"}} />
             <Text style={styles.time}>{time}</Text>
             </View>

             <Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
             
             <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                 <Text style={styles.notes}>{spot.weather.description}</Text>
                 <Text style={styles.notes}>{Math.round( spot.weather.temperature * 10) / 10 }&#8451;</Text>
             </View>
         </Card>
                 {/* <Card style={styles.forcard}><Text>{this.state.weather.temperature} </Text>
                 <Text>{this.state.weather.weatherCondition} </Text>
                 </Card> */}
             </Callout >
             </Marker>
         ))
     }
     </MapView>
     <Carousel
           ref={(c) => { this._carousel = c; }}
           data={this.state.coordinates}
           containerCustomStyle={styles.carousel}
           renderItem={this.renderCarouselItem}
           sliderWidth={Dimensions.get('window').width}
           itemWidth={300}
           removeClippedSubviews={false}
           onSnapToItem={(index) => this.onCarouselItemChange(index)}
           
         />
     </View>
     


)
    }
export default ThirdComponent