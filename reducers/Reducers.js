import {ADD_AVG_SPEED, ADD_COORD, ADD_SPOT, FILTER, SET_DISTANCE, SET_TIME, SET_USER_SPEED, SET_WEATHER} from '../actions/types';



// state = {
//     searchLocation:{},
//      Distance:null,
//      User: {
//        name: "",
//        Speed :0.00,

//      },
//      Avgspeed:[],
//      counter:0,
//      defaultSpeed:  3.12928,
//       Time: 0.0,
//       locationResult:{}
// ,        filter:'',
//       markers : [],
//       // coordinates: [
//       //     {name: 'Cork Street', latitude:53.338161611, longitude: -6.2811350, image: require('./images/corkst.jpg')},
//       //     {name: 'Fair View', latitude:53.3633889, longitude: -6.233694444444445, image: require('./images/fairview.jpg')},
//       //     {name: '1', latitude:53.355998576, longitude:-6.32166538, image: require('./images/corkst.jpg')},
//       //     {name: '2', latitude:53.350140, longitude: -6.5611350,image: require('./images/corkst.jpg')}            
//       // ]
//       ovSpeed:0.00,
//       // timer:25000,
//       coordinates:[],
//       newMarkers : [],
//       weather : { temperature: 0,
//           weatherCondition: null,
//           description:null,
//           icon:null,
//           wind:null},
//           coords:[],
//           modalVisible: false

      
//   }  
const initialState = {
    markers : [
       
    ],
    distance: null,
    User:{
        name: "",
        Speed:0.00
    }

}


const spotReducer = (state = initialState, action) => {
    switch(action.type)  {
        case ADD_SPOT:
            return {...state,
            markers: state.markers.concat({
                location: action.payload.spot
            })
        }
        case SET_DISTANCE:
            return {... state,
            distance: action.payload.distance
        }

        case SET_USER_SPEED:{
            return {...state,
            userSpeed: action.payload.UserSpeed}
        }
        case ADD_AVG_SPEED:{
            return { ...state,
                average: action.payload.avg
            }

        }
        case SET_TIME:{
            return { ...state,
                average: action.payload.time
            }
        }

            
        case ADD_COORD:{
            return { ...state,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude
            }
        }

        case SET_WEATHER:{
            return { ...state,
                weather: action.payload.weather
            }
        }
        case SET_MAP:{
            return {...state,
            mapRegion: action.payload.mapRegion}
        }
        case SET_LOC:{
            return {...state,
                locationResult: action.payload.locationResult}
        }
        case SET_PERM:{
            return {...state,
                hasLocationPermissions: action.payload.hasLocationPermissions}
        }
        case FILTER:{
            return {...state,
                filter: action.payload.filter}
        }
        
    }
}

