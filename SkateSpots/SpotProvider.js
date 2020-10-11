import React, { useState, useEffect } from './node_modules/react';
import {getSpots, getMySpots} from '../SkateSpotsApi';
import * as Geolocation from './node_modules/expo-location';
import * as Permissions from './node_modules/expo-permissions';
const SpotContext = React.createContext();

const SpotProvider = (props) => {

  const [coordinates, setCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [newMarkers, setNewMarkers]= useState([]);
  const [weather, setWeather] = useState({});
  const[ locationResult, setlocationResult] = useState('');
 const[hasLocationPermissions, sethasLocationPermissions] = useState(false);
 const[image, setImage] = useState(null);
 const[Speed, setSpeed] = useState(0);
 const [initialPosition, setinitialPosition]= useState({});




_getLocationAsync = async () => {
        // const spot = useContext(SpotContext);

       let { status } = await Permissions.askAsync(Permissions.LOCATION);
       if (status !== 'granted') {
        setlocationResult({
           locationResult: 'Permission to access location was denied',
         });
        // spot.setLocationResult( 'Permission to access location was denied',)
       } else {
        sethasLocationPermissions({ hasLocationPermissions: true });
        // spot.sethasLocationPermissions(true);
       }
    
       let location = await Geolocation.getCurrentPositionAsync({});
       setlocationResult({ locationResult: JSON.stringify(location) });
    // spot.setLocationResult(JSON.stringify(location))
     let speed = location.speed
     setSpeed({Speed: speed});
     let initialPosition = {
                    
                    latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta:0.09,
                        longitudeDelta: 0.035   
                }
                //this.fetchWeather(location.coords.latitude,location.longitude)
                
    //   spot.setInitialPosition({initialPosition})
       setinitialPosition({initialPosition});
      };
    

  onSpotsRecievedv2 = (coordinatess)=>{
    console.log(coordinates)
    setCoordinates([coordinatess]);
  }
    useEffect(() => {
      _getLocationAsync();
       getSpots(onSpotsRecievedv2)
     })


     

// state = {
//   filter:'',
//   markers : [],
//   // coordinates: [
//   //     {name: 'Cork Street', latitude:53.338161611, longitude: -6.2811350, image: require('./images/corkst.jpg')},
//   //     {name: 'Fair View', latitude:53.3633889, longitude: -6.233694444444445, image: require('./images/fairview.jpg')},
//   //     {name: '1', latitude:53.355998576, longitude:-6.32166538, image: require('./images/corkst.jpg')},
//   //     {name: '2', latitude:53.350140, longitude: -6.5611350,image: require('./images/corkst.jpg')}            
//   // ]
//   coordinates:[],
//   newMarkers : [],
//   weather : { temperature: 0,
//       weatherCondition: null,
//       description:null,
//       icon:null,
//       wind:null},
//       coords:[]
  
// }   

  return (
    <SpotContext.Provider
      value={{
        coordinates,
        markers,
        newMarkers,
        weather,
        locationResult,
        hasLocationPermissions,
        setCoordinates,
        setNewMarkers,
        setWeather,
        setMarkers,
        setlocationResult,
        sethasLocationPermissions,
        image,
        setImage
    
      }}
    >
      {props.children}
    </SpotContext.Provider>
  )
}

export { SpotProvider, SpotContext };