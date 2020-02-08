import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    Dimensions
  } from "react-native";
import React from "react";
import MapView, {PROVIDER_GOOGLE, Marker,Callout} from 'react-native-maps';
import * as Geolocation from 'expo-location';
import * as Permissions from 'expo-permissions';
import Carousel from 'react-native-snap-carousel';



import { __await } from "tslib";
import { runInThisContext } from "vm";
export default class Skatespots extends React.Component {
    state = {
        marker : [],
        coordinates: [
            {name: 'Cork Street', latitude:53.338161611, longitude: -6.2811350, image: require('./images/corkst.jpg')},
            {name: 'Fair View', latitude:53.3633889, longitude: -6.233694444444445, image: require('./images/fairview.jpg')},
            {name: '1', latitude:53.355998576, longitude:-6.32166538, image: require('./images/corkst.jpg')},
            {name: '2', latitude:53.350140, longitude: -6.5611350,image: require('./images/corkst.jpg')}            
        ]
    }   


    componentDidMount() {
        this._getLocationAsync();
      }
    
      _handleMapRegionChange = mapRegion => {
        // console.log(mapRegion);
        this.setState({ mapRegion });
      };
    
      _getLocationAsync = async () => {
       let { status } = await Permissions.askAsync(Permissions.LOCATION);
       if (status !== 'granted') {
         this.setState({
           locationResult: 'Permission to access location was denied',
         });
       } else {
         this.setState({ hasLocationPermissions: true });
       }
    
       let location = await Geolocation.getCurrentPositionAsync({});
       this.setState({ locationResult: JSON.stringify(location) });
       let initialPosition = {
                    
                    latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta:0.09,
                        longitudeDelta: 0.035   
                }
                
       this.setState({initialPosition});
      };
    



      renderCarouselItem = ({item}) =>
      <View style= {styles.cardContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Image style={styles.cardImage} source= {item.image}/>
      </View>


        onCarouselItemChange = (index) =>{
            let location= this.state.coordinates[index];
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035
            })
           this.state.markers[index].showCallout()
        }

        onMarkerPressed = (location, index) => {
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035

            })
            this._carousel.onSnapToItem(index);
        }

    render(){
        return(
            <View style={styles.container}>
       <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => this._map = map}
            showsUserLocation={true}
            style={styles.map}
            initialRegion={this.state.initialPosition}
        >
        
        {/* <Marker
        coordinate= {{latitude:53.338161611, longitude: -6.2811350}} >


         <Callout>
                <Text>Cork Street!</Text>
         </Callout>
         <Image style={{width: 46, height: 38}} source={require('./images/icon.png')}></Image>

        </Marker> */}
        
        {
            this.state.coordinates.map((marker, index) => (
                <Marker
                key= {marker.name}
                ref= {ref => this.state.markers[index] = ref}
                onPress = { ()=> this.onMarkerPressed(marker,index)}
                coordinate= {{latitude: marker.latitude, longitude:marker.longitude}}
               
                title = {marker.name}>

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
        );
}
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
    ...StyleSheet.absoluteFillObject
  },
    carousel:{
      position: 'absolute',
      bottom: 0,
      marginBottom: 48,

    },
    cardContainer:{
        backgroundColor: 'rgba(0, 0,0, 0.6)',
        height:200,
        width:300,
        padding:24,
        borderRadius: 24
    },
    cardImage: {
        height: 120,
        width:300,
        bottom: 0,
        position:'absolute',
        borderBottomLeftRadius:24,
        borderBottomRightRadius:24,

    },
    cardTitle: {
        color: 'white',
        fontSize : 22,
        alignSelf : 'center'
    }
  });