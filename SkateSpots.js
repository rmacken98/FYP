import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    Dimensions,
    Button,
    Modal,
    Picker,
    Alert
    
  } from "react-native";


  import Polyline from '@mapbox/polyline';


import React, {useContext} from "react";
import MapView, {PROVIDER_GOOGLE, Marker,Callout} from 'react-native-maps';
import * as Geolocation from 'expo-location';
import * as Permissions from 'expo-permissions';
import Carousel from 'react-native-snap-carousel';
import {getSpots, getMySpots} from './SkateSpotsApi';
import Firebase from "./config/Firebase";
import AwesomeAlert from 'react-native-awesome-alerts';
import ForecastCard from './components/ForecastCard';
import {  Card, Divider } from 'react-native-elements';
import { API_KEY } from './config/WeatherAPIKey';

import { SpotContext } from './SpotProvider';


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
                }}
                />
            ),
            // headerLeft: (
                
            //     // <Button
            //     // title='View My Spots'
            //     // onPress={console.log('jjj')}/>
            // ),


           

            
        }
        
    };


    state = {
        Time: 0.0,
        Speed :0.0,
        filter:'',
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
            icon:null,
            wind:null},
            coords:[]
        
    }   
    
  
    renderModal = (e) =>{
        // const spot = useContext(SpotContext);

        this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, 
        longitude:  e.nativeEvent.coordinate.longitude}]})


        //with this it would be
    //     spot.setNewMarkers([...NewMarkers,{name:'test',latitude:  e.nativeEvent.coordinate.latitude, 
    //    longitude:  e.nativeEvent.coordinate.longitude}])



        this.props.navigation.navigate("SpotFormScreen", {spot: {name:'',longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude},longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude}
            )
       
       
        
    }
    
    onSpotAdded = (coordinate) => {
        this.setState(prevState => ({
            coordinates: [...prevState.coordinates, coordinate]
        }));

        // const spot = useContext(SpotContext);

        // this would be
        //  spot.setCoordinates([...coordinates,coordinate])

        this.props.navigation.popToTop();
      }
    


     
    onSpotsRecieved = (coordinates)=>{
      // console.log(coordinates);
        this.setState(prevState => ({
            coordinates: prevState.coordinates = coordinates
        }));
        // this would be
        //  spot.setCoordinates([coordinatess])
    }

    componentDidMount() {
      setInterval( this._getLocationAsync(), 30000)

       
        getSpots(this.onSpotsRecieved)
      }
    
      _handleMapRegionChange = mapRegion => {
        // console.log(mapRegion);
        this.setState({ mapRegion });
      };
    
      _getLocationAsync = async () => {
        // const spot = useContext(SpotContext);

       let { status } = await Permissions.askAsync(Permissions.LOCATION);
       if (status !== 'granted') {
         this.setState({
           locationResult: 'Permission to access location was denied',
         });
        // spot.setLocationResult( 'Permission to access location was denied',)
       } else {
         this.setState({ hasLocationPermissions: true });
        // spot.sethasLocationPermissions(true);
       }
    
       let location = await Geolocation.getCurrentPositionAsync({});
       this.setState({ locationResult: JSON.stringify(location) });
    // spot.setLocationResult(JSON.stringify(location))
    if(location.speed < 3.12928){
     let speed = location.speed
     this.setState({Speed: speed});
    }
    else{
      let speed = 3.12928
      this.setState({Speed: speed});
    }
    
     let initialPosition = {
                    
                    latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta:0.09,
                        longitudeDelta: 0.035   
                }
                this.fetchWeather(location.coords.latitude,location.longitude)
                
    //   spot.setInitialPosition({initialPosition})
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

        // const spot = useContext(SpotContext);

        // spot.setMarkers([...spot.markers,
        // {
        //     longitude : e.nativeEvent.coordinate.longitude,
        //     latitude : e.nativeEvent.coordinate.latitude
        // }])


         // console.log(e.nativeEvent.coordinate);
        

      }



      fetchWeather(lat = 25, lon = 25) {
        // const spot = useContext(SpotContext);

        fetch(
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
        )
          .then(res => res.json())
          .then(json => {
          //  console.log(json);
            // spot.setWeather({weather: {
            //     temperature: json.main.temp,
            //     weatherCondition: json.weather[0].main,
            //     description: json.weather[0].description,
            //     icon: json.weather[0].icon,
            //     wind: json.wind.speed
            //   }})
            this.setState({weather: {
              temperature: json.main.temp,
              weatherCondition: json.weather[0].main,
              description: json.weather[0].description,
              icon: json.weather[0].icon,
              wind: json.wind.speed
            }});
          })}

          renderOptions = (marker,index)=>{
            Alert.alert(
                'Alert Title',
                'Alert',
                [
                    {
                        text: 'Cancel',
                        onPress: () => this.onMarkerPressed(marker,index),
                        style: 'cancel',
                      },
                  {text: 'Edit Spot', onPress: () => this.props.navigation.navigate("SpotFormScreen2", {spot: {name:marker.name,longitude:  marker.longitude, latitude:  marker.latitude}
                  ,longitude:  marker.longitude, latitude:  marker.latitude})
                },
                
                  
                ],
                {cancelable: false},
              );
              
          }

          filter = (itemValue, itemIndex) =>{
            this.setState({filter: itemValue});
        
        if(this.state.filter==="All Spots"){
            getSpots(this.onSpotsRecieved);
        }
        else{
            getMySpots(this.onSpotsRecieved);
        }
        
        }

      renderCarouselItem = ({item}) => 
      
      <View style= {styles.cardContainer}
     >
      
          <Text style={styles.cardTitle}>{item.name}
          </Text>
          <Image style={styles.cardImage} source={{uri: item.image}}
         />
      </View>
        

      


     
      
        onCarouselItemChange = (index) =>{
        //     const spot = useContext(SpotContext);
        //    let location= spot.coordinates[index]

            let location= this.state.coordinates[index];
            // so you would just let this equal to spot.coordinates[index] if i had  const spot from the provider
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035
            })
            this.fetchWeather(location.latitude,location.longitude)
           this.state.markers[index].showCallout()
            // spot.markers[index].showCallout()
           
           
        }

        onMarkerPressed = (location, index) => {
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035

            })
            this._carousel.snapToItem(index);
            //this.fetchWeather(location.latitude,location.longitude);
            console.log(this.state.initialPosition.longitude.toString() + "," + this.state.initialPosition.latitude.toString())
            this.getDirections(this.state.initialPosition.latitude.toString() + "," + this.state.initialPosition.longitude.toString(), location.latitude.toString() + ","+
            location.longitude.toString())
        }



        async getDirections(startLoc, destinationLoc) {
          try {
              let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${ destinationLoc }&key=AIzaSyCOVmY_-JN6AY1x5a80rXwTHgLXWtUdf5E`)
            
              let respJson = await resp.json();
              console.log(respJson.routes[0].legs[0].distance)
              let distance=respJson.routes[0].legs[0].distance.value
              let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
              let coords = points.map((point, index) => {
                  return  {
                      latitude : point[0],
                      longitude : point[1]
                  }
              })
              let time = (distance/this.state.Speed)/60
              this.setState({Time: time})
              console.log(time)
              this.setState({coords: coords})

              return coords
          } catch(error) {
              alert(error)
              return error
          }
      }

    render(){
        let time;

		// Create a new date from the passed date time
        var hours = new Date().getHours();

		// Hours part from the timestamp
		// var hours = date.getHours();
		
		// Minutes part from the timestamp
		var minutes = new Date().getMinutes();

		time = hours + ':' + minutes;
        // const spot = useContext(SpotContext);
        return(

                


            <View style={styles.container}>

       <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => this._map = map}
            showsUserLocation={true}
            style={styles.map}
           initialRegion={this.state.initialPosition}
        //    initialRegion={spot.initialPosition}
            onLongPress={this.renderModal}
            // onLongPress= {(e) => {
                
                
            //     this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, longitude:  e.nativeEvent.coordinate.longitude}]})
               
            // }
            // }
            
        >
          
          
          <View>
            <Picker
                 selectedValue={this.state.filter}
                     style={{height: 50, width: 100}}
                     onValueChange={this.filter}
                                              

                         
                         >
  <Picker.Item label="My Spots" value=" My Spots" />
  <Picker.Item label="All Spots" value="All Spots" />
</Picker>
            {/* <Button title='View My Spots'
            style= {styles.forcard}
             onPress={()=> getMySpots(this.onSpotsRecieved)}></Button>
             <View>
             <Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
             {/* <Button title='View All Spots'
    style= {styles.forcard}
            onPress={()=> getSpots(this.onSpotsRecieved)}>
            </Button> */}
             {/* </View> */} 
             
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
            this.state.coordinates.map((marker, index) => (
                // spot.coordinates.map((marker, index) => (
                <Marker
                key= {marker.name}
               ref= {ref => this.state.markers[index] = ref}
            //   ref= {ref => spot.markers[index] = ref}
                onPress = {   ()=> this.renderOptions(marker,index)}
            
                coordinate= {{latitude: marker.latitude, longitude:marker.longitude}}
                // onLongPress= {()=> this.props.navigation.navigate("Login")}
               
                title = {marker.name}>
                {/* <Image style={{width: 46, height: 38}} source={require('./images/icons8-skateboard-50.png')}></Image> */}
                  <Callout 
                   
                  tooltip={true}>
                  <Card containerStyle={styles.forcard}>
				<Text style={styles.notes}>{this.state.location}</Text>
				
				<View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Image style={{width:100, height:100}} source={{uri:"https://openweathermap.org/img/w/" + this.state.weather.icon + ".png"}} />
                <Text style={styles.time}>{time}</Text>
				</View>

				<Divider style={{ backgroundColor: '#dfe6e9', marginVertical:20}} />
				
				<View style={{flexDirection:'row', justifyContent:'space-between'}}>
					<Text style={styles.notes}>{ this.state.weather.description}</Text>
					<Text style={styles.notes}>{Math.round(  this.state.weather.temperature * 10) / 10 }&#8451;</Text>
				</View>
			</Card>
                    {/* <Card style={styles.forcard}><Text>{this.state.weather.temperature} </Text>
                    <Text>{this.state.weather.weatherCondition} </Text>
                    </Card> */}
                </Callout >
                </Marker>
            ))
        }




<MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red"/>

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
    },
    form: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
      },
  });