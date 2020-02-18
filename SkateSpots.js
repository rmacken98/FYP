import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    Dimensions,
    Button,
    Modal,
    
  } from "react-native";

import React from "react";
import MapView, {PROVIDER_GOOGLE, Marker,Callout} from 'react-native-maps';
import * as Geolocation from 'expo-location';
import * as Permissions from 'expo-permissions';
import Carousel from 'react-native-snap-carousel';
import {getSpots} from './SkateSpotsApi';
import Firebase from "./config/Firebase";
import AwesomeAlert from 'react-native-awesome-alerts';
import ForecastCard from './components/ForecastCard';
import {  Card, Divider } from 'react-native-elements';
import { API_KEY } from './config/WeatherAPIKey';



import { __await } from "tslib";


export default class Skatespots extends React.Component {
  
//setstate e.nativeEvent.cordinates add it and should diplay a new marker


    static navigationOptions = ({navigation}) => {

        

        return {
            title: 'Skatespots',
            headerRight: (
                <Button
                title='log out'
                onPress={handleSignout = () => {
                    Firebase.auth().signOut()
                    .then(() => navigation.navigate("Login"))
                }}/>
            ),
            headerLeft: (
                <Button
                title='View My Spots'
                onPress={console.log('uo')}/>
            ),


           

            
        }
        
    };


    state = {
        markers : [],
        // coordinates: [
        //     {name: 'Cork Street', latitude:53.338161611, longitude: -6.2811350, image: require('./images/corkst.jpg')},
        //     {name: 'Fair View', latitude:53.3633889, longitude: -6.233694444444445, image: require('./images/fairview.jpg')},
        //     {name: '1', latitude:53.355998576, longitude:-6.32166538, image: require('./images/corkst.jpg')},
        //     {name: '2', latitude:53.350140, longitude: -6.5611350,image: require('./images/corkst.jpg')}            
        // ]
        coordinates:[],
        newMarkers : [],
        weather : { temperature: 0,
            weatherCondition: null,
            description:null,
            icon:null}
        
    }   
    
  
    renderModal = (e) =>{
        this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, 
        longitude:  e.nativeEvent.coordinate.longitude}]})
        this.props.navigation.navigate("SpotFormScreen", {longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude}
            )
       
       
        
    }
    




    onSpotsRecieved = (coordinates)=>{
        console.log(coordinates);
        this.setState(prevState => ({
            coordinates: prevState.coordinates = coordinates
        }));
    }

    componentDidMount() {
        this._getLocationAsync();
        getSpots(this.onSpotsRecieved)
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
                this.fetchWeather(location.coords.latitude,location.longitude)
                
       this.setState({initialPosition});
      };
    
      onMapPress= e => {
          this.setState({
              markers: [
                  ...this.state.markers,
                  {
                    longitude : e.nativeEvent.coordinate.longitude,
                    latitude : e.nativeEvent.coordinate.latitude

                  }
                 
              ]
              
          })
          console.log(e.nativeEvent.coordinate);
        

      }



      fetchWeather(lat = 25, lon = 25) {
        fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
        )
          .then(res => res.json())
          .then(json => {
            console.log(json);
            this.setState({weather: {
              temperature: json.main.temp,
              weatherCondition: json.weather[0].main,
              description: json.weather[0].description,
              icon: json.weather[0].icon
            }});
          })}


      renderCarouselItem = ({item}) =>
      
      <View style= {styles.cardContainer}>
      
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Image style={styles.cardImage} source={{uri: item.image}}/>
      </View>
      

        onCarouselItemChange = (index) =>{
            let location= this.state.coordinates[index];
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035
            })
            this.fetchWeather(location.latitude,location.longitude)
           this.state.markers[index].showCallout()
        }

        onMarkerPressed = (location, index) => {
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035

            })
            this._carousel.snapToItem(index);
            this.fetchWeather(location.latitude,location.longitude);
        }

    render(){
        return(

                


            <View style={styles.container}>
             <Modal visible={false}>
        <View><Text>Hello</Text></View>
        </Modal>
       <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => this._map = map}
            showsUserLocation={true}
            style={styles.map}
            initialRegion={this.state.initialPosition}
            onLongPress={this.renderModal}
            // onLongPress= {(e) => {
                
                
            //     this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, longitude:  e.nativeEvent.coordinate.longitude}]})
               
            // }
            // }
            
        >
           {
            this.state.newMarkers.map((marker, index) => (
                <Marker
                key= {marker.name}
                onPress = { ()=> this.onMarkerPressed(marker,index)}
                coordinate= {{latitude: marker.latitude, longitude:marker.longitude}}
               
                title = {marker.name}>
              

                </Marker>
            ))
        }
        
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
                // onLongPress= {()=> this.props.navigation.navigate("Login")}
               
                title = {marker.name}>
                  <Callout 
                  tooltip={true}>
                  <Card containerStyle={styles.forcard}>
				<Text style={styles.notes}>{this.state.location}</Text>
				
				<View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Image style={{width:100, height:100}} source={{uri:"https://openweathermap.org/img/w/" + this.state.weather.icon + ".png"}} />
					<Text style={styles.time}>16:00</Text>
				</View>

				<Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
				
				<View style={{flexDirection:'row', justifyContent:'space-between'}}>
					<Text style={styles.notes}>{this.state.weather.description}</Text>
					<Text style={styles.notes}>{Math.round( this.state.weather.temperature * 10) / 10 }&#8451;</Text>
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
    },
    forcard:{
		backgroundColor:'rgba(56, 172, 236, 1)',
		borderWidth:0,
		borderRadius:20
    },
    time:{
		fontSize:38,
		color:'#fff'
	},
	notes: {
		fontSize: 18,
		color:'#fff',
		textTransform:'capitalize'
	}
  });