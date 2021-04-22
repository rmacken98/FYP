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
    Alert,
    TouchableHighlight
    
  } from "react-native";
  import Polyline from './node_modules/@mapbox/polyline';
import React from "./node_modules/react";
import {useContext} from 'react';
import MapView  from 'react-native-maps';
import {PROVIDER_GOOGLE, Marker,Callout} from 'react-native-maps';
import * as Geolocation from './node_modules/expo-location';
import * as Permissions from './node_modules/expo-permissions';
import Carousel from './node_modules/react-native-snap-carousel';
import {getSpots, getMySpots,addTime,getTime} from './SkateSpotsApi';
import Firebase from "./config/Firebase";
import AwesomeAlert from './node_modules/react-native-awesome-alerts';
import ForecastCard from './components/ForecastCard';
import {  Card, Divider, Rating, withTheme } from './node_modules/react-native-elements';
import { API_KEY } from './config/WeatherAPIKey';
import {GooglePlacesAutoComplete} from './node_modules/react-native-google-places-autocomplete'
import { SpotContext } from './SpotProvider';
import {AirbnbRating} from 'react-native-ratings'
import {connect} from 'react-redux';
import { __await } from "./node_modules/tslib";
import SearchBar from "./SearchBar";

import { addSpot, locationResult, set_MapRegion, set_Permission, set_Weather } from "./actions/actions";

class Skatespots extends React.Component {
  
//setstate e.nativeEvent.cordinates add it and should diplay a new marker



    static navigationOptions = ({navigation}) => {


        
       
       

        return {

// headerLeft: <Text 
// //onPress={() =>  this.props.navigation.openDrawer()}
//   >Menu</Text>,

          drawerLabel: 'Spots',
          drawerIcon: ({ tintColor }) => (
            <Image
              source={require('./images/icons8-skateboard-50.png')}
              style={[styles.icon, { tintColor: tintColor }]}
            />
           )
          //   title: 'Skatespots',
          //   headerRight: (
          //       <Button
          //       title='log out'
          //       onPress={handleSignout = () => {
          //           Firebase.auth().signOut()
          //           .then(() => navigation.navigate("Login"))
          //       }}
          //       />
          //   ),
            // headerLeft: (
                
            //     // <Button
            //     // title='View My Spots'
            //     // onPress={console.log('jjj')}/>
            // ),


           

            
        }
        
    };


    state = {
      searchLocation:{},
       Distance:null,
       User: {
         name: "",
         Speed :0.00,

       },
       Avgspeed:[],
       counter:0,
       defaultSpeed:  3.12928,
        Time: 0.0,
        locationResult:{},
         filter:'',
        markers : [],
   
        ovSpeed:0.00,
        coordinates:[],
        newMarkers : [],
        weather : { temperature: 0,
            weatherCondition: null,
            description:null,
            icon:null,
            wind:null},
            coords:[],
            modalVisible: false

        
    }   

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }
    getLocationFromName(loc){
      this.setState({newMarkers: [...this.state.newMarkers, {name:loc.name,latitude:loc.lat, 
        longitude: loc.lng}]})
const locations= {
  latitude:loc.lat,
  longitude: loc.lng,

}
        // console.log(loc);
        this._map.animateToRegion({
          latitude:loc.lat,
          longitude: loc.lng,
          latitudeDelta:0.09,
          longitudeDelta: 0.035
      })
      this.setState({searchLocation:loc} );
      const { modalVisible } = this.state;
      this.setModalVisible(true);

      
    }
    
  
    renderModal = (e) =>{

        this.setState({newMarkers: [...this.state.newMarkers, {name:'',latitude: e.nativeEvent.coordinate.latitude, 
        longitude:  e.nativeEvent.coordinate.longitude}]})
    

        this.props.navigation.navigate("SpotFormScreen", {spot: {name:'',longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude},longitude:  e.nativeEvent.coordinate.longitude, latitude:  e.nativeEvent.coordinate.latitude}
            )
       
       
        
    }
    
    onSpotAdded = (coordinate) => {
        this.setState(prevState => ({
            coordinates: [...prevState.coordinates, coordinate]
        }));

      
        this.props.navigation.popToTop();
      }
    
      onSpotsRecieved = (coordinates)=>{
        // console.log(coordinates);
          this.setState(prevState => ({
              coordinates: prevState.coordinates = coordinates
          }));
          // this would be
          //  spot.setCoordinates([coordinatess])
          // console.log(coordinates)
          // store.dispatch(addSpot(coordinates))
       


      }
   
     
    onTimeRecieved = (Avgspeed)=>{
      // console.log(coordinates);
        this.setState(prevState => ({
            Avgspeed: prevState.Avgspeed = Avgspeed
        }));
        // this would be
        //  spot.setCoordinates([coordinatess])
    }

    componentDidMount() {
      this._getLocationAsync();
      // setInterval(this._getLocationAsync.bind(this),this.state.timer)

        getSpots(this.onSpotsRecieved)
        getTime(this.onTimeRecieved)
      }
    
      _handleMapRegionChange = mapRegion => {
        // console.log(mapRegion);
       this.setState({ mapRegion });
      //  store.dispatch(set_MapRegion(mapRegion));
      };
    
      _getLocationAsync = async () => {
        // const spot = useContext(SpotContext);

       let { status } = await Permissions.askAsync(Permissions.LOCATION);
       if (status !== 'granted') {
         this.setState({
           locationResult: 'Permission to access location was denied',
         });
        // store.dispatch(locationResult("Permission to access location was denied"))

       } else {
         this.setState({ hasLocationPermissions: true });
        // spot.sethasLocationPermissions(true);
        // store.dispatch(set_Permission(true))
       }
    
       let location = await Geolocation.getCurrentPositionAsync({});
      //  console.log(JSON.stringify(location))
      this.setState({ locationResult: JSON.stringify(location) });
    //  store.dispatch(locationResult(JSON.stringify(location)))
       
    
    // spot.setLocationResult(JSON.stringify(location))
   // if(location.speed > 3.12928){
  //    let speed = parseFloat(location.coords.speed)
    
  //    this.setState({counter: this.state.counter+1})
  //    this.setState({ovSpeed: this.state.ovSpeed+speed})
  //    console.log(this.state.ovSpeed)
  //    if(this.state.counter==5){
  //      let speed2= this.state.ovSpeed/5;
  //     this.setState({User:{name: Firebase.auth().currentUser.email,Speed: speed2}});
  //    addTime(this.state.User);
  //  // }
  //   }
    // else{
    //   let speed = 3.12928
    //   this.setState({User:{ name: "a@a.com",Speed: speed}});
    // }

    
     let initialPosition = {
                    
                    latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta:0.09,
                        longitudeDelta: 0.035   
                }
                this.fetchWeather(location.coords.latitude,location.longitude)
                
    //   spot.setInitialPosition({initialPosition})
      this.setState({initialPosition});
    //  store.dispatch(initialPosition(initialPosition));
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
        // let spot = {longitude : e.nativeEvent.coordinate.longitude,
        //              latitude : e.nativeEvent.coordinate.latitude}
          // store.dispatch(addSpot(spot));

        // const spot = useContext(SpotContext);

        // spot.setMarkers([...spot.markers,
        // {
        //     longitude : e.nativeEvent.coordinate.longitude,
        //     latitude : e.nativeEvent.coordinate.latitude
        // }])


         // console.log(e.nativeEvent.coordinate);
        

      }



      fetchWeather(lat, lon) {
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
          //  let weather = {
          //         temperature: json.main.temp,
          //         weatherCondition: json.weather[0].main,
          //         description: json.weather[0].description,
          //         icon: json.weather[0].icon,
          //         wind: json.wind.speed
              
          //   }

          //   store.dispatch(set_Weather(weather))

            
          })}

          renderOptions = (marker,index)=>{
            this.state.markers[index].hideCallout();
            Alert.alert(
                '',
                'Alert',
                [
                  {text: 'Edit Spot', onPress: () => this.props.navigation.navigate("SpotFormScreen2", {spot: {name:marker.name,longitude:  marker.longitude, latitude:  marker.latitude}
                  ,longitude:  marker.longitude, latitude:  marker.latitude})
                },
                    {
                        text: 'Get directions',
                        onPress: () => this.onMarkerPressed(marker,index),
                       
                      },
                      {
                        text: 'Get Weather',
                        onPress: () =>  this.state.markers[index].showCallout()
                      },

                      {
                        text: 'Cancel',
                       
                        style: 'cancel',
                      },
                
                  
                ],
                {cancelable: false},
              );
              
          }

          filter = (itemValue, itemIndex) =>{
            this.setState({filter: itemValue});
            // store.dispatch(filter(itemValue))
        
        if(itemValue==="All Spots"){
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
        if(index >0){
        this.state.markers[index-1].hideCallout();
        }
        else{
          this.state.markers[index].hideCallout();
        }
            let location= this.state.coordinates[index];
            // so you would just let this equal to spot.coordinates[index] if i had  const spot from the provider
            this._map.animateToRegion({
                latitude:location.latitude,
                longitude: location.longitude,
                latitudeDelta:0.09,
                longitudeDelta: 0.035
            })
            this.fetchWeather(location.latitude,location.longitude)
          
           
           
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
            
              let respJson = await resp.json()
              console.log(respJson)
              let distance=respJson.routes[0].legs[0].distance.value
              let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
              let coords = points.map((point, index) => {
                  return  {
                      latitude : point[0],
                      longitude : point[1]
                  }
              })
              this.setState({Distance:respJson.routes[0].legs[0].distance.text})
              let defspeed = this.state.defaultSpeed
             // for( i =0; i<this.state.Avgspeed.length(); i++){
                if (this.state.Avgspeed[0].name=== Firebase.auth().currentUser.email){
             let avgspeed= parseFloat(this.state.Avgspeed[0].Speed)
            
              
            //console.log(avgspeed)
              if(avgspeed<2){
                let time = (distance/defspeed)/60
                let timer = (time*60000)/5
                console.log(timer)
              this.setState({timer:timer})
              this.setState({Time: time})
              console.log(time)
              this.setState({coords: coords})
              // setInterval( this._getLocationAsync(), 30000)


              return coords
              }else{
                let time = (distance/avgspeed)/60
                let timer = (time*60000)/5
              this.setState({timer:timer})
              this.setState({Time: time})
              console.log(timer)
              this.setState({coords: coords})
               
              // setInterval( this._getLocationAsync(), 30000)


              return coords
              }
            }
             
              
          } catch(error) {
              alert(error)
              return error
          }
      }

    render(){
        let time;
        const { modalVisible } = this.state;
		// Create a new date from the passed date time
        var hours = new Date().getHours();

		// Hours part from the timestamp
		// var hours = date.getHours();
		
		// Minutes part from the timestamp
		var minutes = new Date().getMinutes();

		time = hours + ':' + minutes;
        // const spot = useContext(SpotContext);
        return(

         
          <View style={{flex:1}}>
              {/* <View style={{ flex: 1 }}>
                    <SearchBar notifyChange={(loc) => this.getLocationFromName(loc)}
                    />
                </View> */}



 {/* <View style={{ flex:.15 }}>
                    <SearchBar
                    notifyChange={(loc) => this.getLocationFromName(loc)}
                    />
                </View> */}
                <View style={{flex:1}}>
       <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => this._map = map}
            showsUserLocation={true}
            style={{ flex: 1 }}
           initialRegion={this.state.initialPosition}
        //    initialRegion={spot.initialPosition}
            onLongPress={this.renderModal}
            // onLongPress= {(e) => {
                
                
            //     this.setState({newMarkers: [...this.state.newMarkers, {name:'test',latitude: e.nativeEvent.coordinate.latitude, longitude:  e.nativeEvent.coordinate.longitude}]})
               
            // }
            // }
            
        >
         

          <View style={{alignItems:'center'}}><Text style={styles.distance}> Distance to destination: {this.state.Distance}</Text>
          <Text style={styles.distance}> Estimated Journey time : {this.state.Time} minutes</Text>
          </View>
          {/* // seperate to function */}
          
          
          <View>
            <Picker
                 selectedValue={this.state.filter}
                     style={{height: 50, width: 100}}
                     onValueChange={this.filter}
                                              

                         
                         >
  <Picker.Item label="All Spots" value="All Spots" />
  <Picker.Item label="My Spots" value="My Spots" />
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
             <View>
      <Modal
      
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}>
 <View>
            <View >
            {/* <AirbnbRating
  count={11}
 // reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "s"]}
  defaultRating={11}
  size={20}
/> */}
{/* 'Alert',
      //   [
      //     {text: 'Add Spot',}
      //     ,longitude:  loc.longitude, latitude:  loc.latitude})
      //   },
      //       { */}
      {/* //           text: 'Get directions',
      //           onPress: () => this.onMarkerPressed(locations,0),
               
      //         }, */}
              <TouchableHighlight
                style={{  backgroundColor: "#2196F3" }}
                onPress= {() => this.props.navigation.navigate("SpotFormScreen", {spot: {name:searchLocation.name,longitude:  searchLocation.lng, latitude:  searchLocation.lat}})}
              >
                <Text >Add Spot</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
        
     
        
        {
            this.state.coordinates.map((marker, index) => (
              
                <Marker
                key= {marker.name}
               ref= {ref => this.state.markers[index] = ref}
           
                onPress = {   ()=> this.renderOptions(marker,index)}
               

                coordinate= {{latitude: marker.latitude, longitude:marker.longitude}}
              
               
                title = {marker.name}>
               
                  <Callout 
                   onPress={ () => this.state.markers[index].hideCallout()}
                                       tooltip={true}>
                  <Card containerStyle={styles.forcard} >
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
              itemWidth={150}
              removeClippedSubviews={false}
              onSnapToItem={(index) => this.onCarouselItemChange(index)}
              
            />
        </View>
        </View>


        );
}
}



const styles = StyleSheet.create({
  search: {
    position:'absolute'
  },

    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
    ...StyleSheet.absoluteFillObject
  },
    carousel:{
      position: 'absolute',
      bottom: 0,
      marginBottom: 24,

    },
    cardContainer:{
        backgroundColor: 'rgba(0, 0,0, 0.6)',
        height:100,
        width:150,
        padding:12,
        borderRadius: 12
    },
    cardImage: {
        height: 60,
        width:150,
        bottom: 0,
        position:'absolute',
        borderBottomLeftRadius:12,
        borderBottomRightRadius:12,

    },
    cardTitle: {
        color: 'white',
        fontSize : 14,
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
    distance:{
      backgroundColor:"#FFFFFF",
    },

    form: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
      },
  });
  export default Skatespots;
