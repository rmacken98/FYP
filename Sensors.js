import React from 'react';
import {Component,useState, useEffect ,useCallback} from 'react';
import {Button} from './components/Button';
import { WebView } from 'react-native-webview';
import io from 'socket.io-client';
import {
  StyleSheet,
  Text,
  View,
  Alert
  ,Picker,
  ScrollView
} from 'react-native';
import {send, getMessages,getMyMessages} from './SkateSpotsApi';
import Firebase from "./config/Firebase";
import {
    Accelerometer,
  DeviceMotion,
    Gyroscope
  } from 'expo-sensors';
import {Col, Grid, Row } from 'react-native-easy-grid';
class Sensors extends Component {
    
  static navigationOptions = ({ navigation }) => {

   

    return {
   
    }
  };

  state = {

      handRaised: false,
      DeviceData:[],    
      accelerometerData:{x: 0, y: 0, z: 0   },
      Barometer:{},
      trickAttempt:0,
      trickCount:0,
      flightTime:0.0,
      filter:'',
      landed:false,
      streak:0,
      playing:false,
      tutorials:["https://www.youtube.com/watch?v=arDVW-aWWys","https://www.youtube.com/watch?v=s-Tw11EZCv4",
      "https://www.youtube.com/watch?v=EZhbRmYHjlI" ],
 
      chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      },

      data : [
        {
          Trick: "Ollie lands",
          number: 15,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Ollie attempts",
          number: 24,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }
      ]
    
    }

    
  
      sleep =(ms) =>{
      return new Promise(resolve => setTimeout(resolve, ms));
    }
 
  
//   Fast =() => {


   
//       // for trick detection wait for a spike in the y axis speed and
//   // if the x axis doesn't go below threshold count the trick as landed otherwise it is an attempt

// //jump flight time formula =  Math.sqrt(Math.pow(accelerometerData.x,2)+ Math.pow(accelerometerData.y,2) + Math.pow(accelerometerData.z,2)) 
// //wait for timeout period to calculate
// Accelerometer.setUpdateInterval(5000);

// //   console.log(accelerometerData.y);
// //   console.log(this.state.Barometer);
// var ySpeed = this.state.accelerometerData.y;
// var xSpeed = this.state.accelerometerData.x;
// var zSpeed = this.state.accelerometerData.z;
    
    
//       // DeviceMotion.setUpdateInterval(100);
//       //for rotation if the starting rotation increases 360 or 180 +1 for 360 and +.5 for 180
//       // var gyro = this.state.DeviceData.rotation
//       // console.log(gyro);
//     //  var  yaw = Math.atan2(this.state.DeviceData.rotation.y, -(this.state.DeviceData.rotation.z)) * 180 / Math.PI;// In degrees
   
// // console.log('degrees: '+yaw)
//     let flightTime = Math.sqrt(Math.pow(xSpeed,2)+ Math.pow(ySpeed,2) + Math.pow(zSpeed,2)) 

//     // var alt =this.state.Barometer.relativeAltitude;
//     if(ySpeed>0.5){
//     console.log('------------------------');
//     // console.log('Yaw: ' + yaw);
//     console.log('y:' + ySpeed.toFixed(3));
//     console.log('x:' + xSpeed.toFixed(3));
//     console.log('z:' + zSpeed.toFixed(3));


//     // console.log(alt.toFixed(3));
//     console.log('------------------------');
//     }
//     this.setState(prevState => ({
//         flight: prevState.flightTime = flightTime
//       }));


//     if(ySpeed>0.5){
//         this.setState(prevState => ({
//             trickAttempt: prevState.trickAttempt+1
            
//           }));
//           this.setState({ DeviceData: [] });
    
//       }
//       if (ySpeed>0.5 && this.state.accelerometerData.x<0.5){
//         // this.setState({ landed: false });
//         this.setState({ streak: 0 });

//       }
//       // Maybe only count as landed if x speed with is anything greater .5  of what it was before the y axis increase in speed or if is a max of .5 slower
//      if (ySpeed>0.5 && this.state.accelerometerData.x>0.5){
//         this.setState(prevState => ({
//             trickCount: prevState.trickCount+1,
//             streak: prevState.streak+1
            
//           }));
//           this.setState({ DeviceData: [] });
//           // this.setState({ landed: true });
        
//       }
    
    
//   };

detectTrick= async () =>{
DeviceMotion.setUpdateInterval(5000)
// console.log(this.state.DeviceData);
 var ySpeed = this.state.DeviceData.acceleration.y;
 var xSpeed = this.state.DeviceData.acceleration.x;
 var zSpeed = this.state.DeviceData.acceleration.z;
//var rotation =  this.state.deviceData.rotationRate;
var  yaw = Math.atan2(this.state.DeviceData.rotation.gamma, -this.state.DeviceData.rotation.alpha) * 180 / Math.PI;
var  pitch = Math.atan2(-this.state.DeviceData.rotation.beta, -this.state.DeviceData.rotation.alpha) * 180 / Math.PI;// In degrees
var roll = Math.atan2(-this.state.DeviceData.rotation.gamma, -this.state.DeviceData.rotation.beta) * 180 / Math.PI;// In degrees

console.log('yaw : '+yaw +" degrees");
console.log('pitch : '+pitch +" degrees");
console.log('roll : '+roll +" degrees");


let flightTime = Math.sqrt(Math.pow(xSpeed,2)+ Math.pow(ySpeed,2) + Math.pow(zSpeed,2)) 

// var alt =this.state.Barometer.relativeAltitude;
if(ySpeed>0.5){
console.log('------------------------');
 console.log('Yaw: ' + yaw + "degrees");
console.log('y:' + ySpeed.toFixed(3));
console.log('x:' + xSpeed.toFixed(3));
console.log('z:' + zSpeed.toFixed(3));


// console.log(alt.toFixed(3));
console.log('------------------------');
}
this.setState(prevState => ({
    flight: prevState.flightTime = flightTime
  }));



  if (ySpeed>0.5 && xSpeed>0.5){
    await this.sleep(2000); 
    speed = this.state.DeviceData.acceleration.x;
    if(xSpeed<speed){
    this.setState(prevState => ({
      trickAttempt: prevState.trickAttempt+1,
        trickCount: prevState.trickCount+1,
        streak: prevState.streak+1
      }));
    }}
    else if(ySpeed>0.5 && xSpeed<0.5){
      this.setState(prevState => ({
          trickAttempt: prevState.trickAttempt+1
        }));
        await this.sleep(3000);
  
    }
  if (ySpeed>0.5 && xSpeed<0.5){
    // this.setState({ landed: false });
    this.setState({ streak: 0 });
    

  }
  // Maybe only count as landed if x speed with is anything greater .5  of what it was before the y axis increase in speed or if is a max of .5 slower
 


      // this.setState({ landed: true });
    
  
}


        




DeviceMotionSub = () => {
  this.d_sub = DeviceMotion.addListener((DeviceData) => {
    this.setState({DeviceData});
   this.detectTrick();
    
  });
}



_subscribe = () => {
  // When invoked, the listener is provided a single argumument that is an object containing keys x, y, z.
  this._subscription = Accelerometer.addListener((accelerometerData) => {
    this.setState({ accelerometerData });
    this.Fast();
  });
}
_unsubscribe = () => {
  this.DeviceMotionSub && this.DeviceMotionSub.remove();
  this.DeviceMotionSub = null;
}

componentWillUnmount() {
 
  this._unsubscribe();
}

componentDidMount() {
  this.DeviceMotionSub();
}

componentWillMount() {
  // const { width, height } = Dimensions.get('window');
  // this.screenWidth = width;
  // this.screenHeight = height;
  // this.boxWidth = this.screenWidth / 10.0;
}

  filter = (itemValue, itemIndex) =>{
    this.setState({filter: itemValue});
    // store.dispatch(filter(itemValue))



}



  render() {

    return (
      <ScrollView style={styles.containerStyle}>

      {/* <View style={styles.textContainerStyle}>
      <Text>Attempts: {this.state.trickAttempt}</Text>
          <Text></Text>
      </View>

      <View style={styles.textContainerStyle}>
      
          <Text> Lands : {this.state.trickCount}</Text>
          <Text></Text>ddd
      </View> */}
      {/* <Button onPress={this.Fast()}>
          <Text>Start</Text></Button> */}
      <Grid>
      <Row style={{ height: 40,  justifyContent: 'center' }}>
        
      </Row>

<Row style={{ height: 240,  justifyContent: 'center' }}>
<Picker
                 selectedValue={this.state.filter}
                     style={{ height: 50, width: 150 }}
                     onValueChange={this.filter}
                                              

                         
                         >
  <Picker.Item label="Select Tricks" value=" default" />
  <Picker.Item label="Ollie" value="ollie" />
  <Picker.Item label="Kickflip" value="kf" />
  <Picker.Item label="FS Ollie 180" value="o180" /> 

 </Picker>
</Row>

<Row style={{height:40,justifyContent: 'center'}}>
<Text>Total</Text>
    </Row>
      <Row style={{ height: 40,justifyContent: 'center' }}>
        <Col style={{alignItems: 'center'}}>
      <Text>Attempts: {this.state.trickAttempt}</Text>
      </Col>
      <Col style={{alignItems: 'center'}}>
<Text> Lands : {this.state.trickCount}</Text></Col>
    </Row>

    <Row style={{ height: 40,justifyContent: 'center' }}>
        <Col style={{alignItems: 'center'}}>
      <Text>Falls: {this.state.trickAttempt}</Text>
      </Col>
      <Col style={{alignItems: 'center'}}>
<Text> Streak : {this.state.streak}</Text></Col>
    </Row>


    <Row style={{height:40,justifyContent: 'center'}}>
<Text>Goals</Text>
    </Row>
    <Row style={{ height: 40 ,justifyContent: 'center'}}>
    <Col style={{alignItems: 'center'}}>
      <Text>Daily: 0/25</Text>
      </Col>
      <Col style={{alignItems: 'center'}}>
<Text> Weekly : 0/50</Text></Col>
    </Row>
   

    <Row style={{height:40,justifyContent: 'center'}}>
<Text>Graph Stats</Text>
    </Row>
<Row style={{height:400,justifyContent: 'center'}} >

      
</Row>

      </Grid>
      <PieChart
  data={this.state.data}
  width={screenWidth}
  height={220}
  chartConfig={this.state.chartConfig}
  accessor={"number"}
  backgroundColor={"transparent"}
  paddingLeft={"15"}
  center={[10, 50]}
  absolute
/>
  </ScrollView>
    //   <View style={styles.textContainer}>
    //     <Button onPress={this.Fast} >
    //       <Text>Update</Text>
    //     </Button>
    //     <Text style={styles.emptyTitle}>Jump Flight Time  = {this.state.flightTime} </Text>
    // <Text style={styles.emptyTitle}>Tricks attempted = {this.state.trickAttempt} </Text>
    //     <Text style={styles.emptyTitle}>Tricks landed = {this.state.trickCount}</Text>
    //     <Text style={styles.emptySubtitle}></Text>
       
    //   </View>
     ); }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
    backgroundColor: '#ecf0f1',
  },
    header:{
        
     
      justifyContent: 'center',
            margin: 10,
    },
    textContainerStyle: {
     
      margin: 30,
     
    },
    picker: {
      
        flex: 1,
        paddingTop: 40,
        alignItems: "center"
     }

}
);

export default Sensors;