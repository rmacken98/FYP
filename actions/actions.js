import * as actions from './types';

export const addSpot = (spot) => (
{
    type: actions.ADD_SPOT,
   payload:{
      spot
   }
});

export const setDistance = (distance)=>(
    {
        type: actions.SET_DISTANCE,
       payload:{
          distance
       }
    });

export const setUserSpeed = (UserSpeed)=> (
    {
        type: actions.SET_USER_SPEED,
       payload:{
          UserSpeed
       }
    });

export const addAvgSpeed = (avg) => ({
    type: actions.ADD_AVG_SPEED,
    payload:{
        avg
    }
});

export const setTime = (time)=> ({
    type: actions.SET_TIME,
    payload: {
        time
    }
});

export const setCoords = (latitude,longitude)=> ({
    type: actions.ADD_COORD,
    payload: {
        latitude,
        longitude
    }
});

export const set_Weather = (weather)=> ({
    type:actions.SET_WEATHER,
    payload:{
        weather
    }
})

export const set_MapRegion =(mapRegion)=> ({
    type:actions.SET_MAP,
    payload:{
        mapRegion
    }
})

export const locationResult =(locationResult)=>({
    type:actions.SET_LOC,
    payload:{
        locationResult
    }

})

export const set_Permission =(hasLocationPermissions)=>({
    type: actions.SET_PERM,
    payload:{
        hasLocationPermissions
    }
})

export const initialPosition = (initialPosition) =>({
    type: actions.SET_IP,
    payload:{
        initialPosition
    }
})

// export const filter = (filter) =>({
//     type: actions.FILTER,
//     payload:{
//         filter
//     }
// })