import React from 'react';
import {Component,useState, useEffect ,useCallback} from 'react';
import {Button} from './components/Button';
import { WebView } from 'react-native-webview';
import Firebase from './config/Firebase';
import {
  StyleSheet,
  Text,
  View,Picker,
  ScrollView, 
  Dimensions
} from 'react-native';
import { sendTrickData} from './SkateSpotsApi';
import {
    Accelerometer,
  DeviceMotion,
    
  } from 'expo-sensors';
  import DropDownPicker from 'react-native-dropdown-picker';
import {Col, Grid, Row } from 'react-native-easy-grid';
class Sensors extends Component {
  
  static navigationOptions = ({ navigation }) => {

   

    return {
   
    }
  };

  state = {
    screenWidth : Dimensions.get("window").width,
    start:false,
      handRaised: false,
      DeviceData:[], 
      Date:"",
      TrickType:'',
        uid:'',
        trickAttempt:0,
        trickCount:0,
        streak:0,
        fails:0
      ,  
      accelerometerData:{x: 0, y: 0, z: 0 },
      timerAfter:0,
      Barometer:{},
      xAccelerationDuring: 0,
    
      flightTime:0.0,
      filter:'',
      landed:false,
     
      wait:false,
 
      trick: [
        { label: "Ollie", value: "Ollie" },
        { label: "Heelflip", value: "Heelflip" },
        { label: "KickFlip", value: "KickFlip" },
      ],



      data:[],
      started:false,
   
    }
    

detectTrick= async () =>{

  if(this.state.started){
DeviceMotion.setUpdateInterval(1000)

// console.log(this.state.DeviceData);
 var ySpeed = this.state.DeviceData.acceleration.y;
 var xSpeed = this.state.DeviceData.acceleration.x;
 var zSpeed = this.state.DeviceData.acceleration.z;
//var rotation =  this.state.deviceData.rotationRate;
var  yaw = Math.atan2(this.state.DeviceData.rotation.gamma, -this.state.DeviceData.rotation.alpha) * 180 / Math.PI;
var  pitch = Math.atan2(-this.state.DeviceData.rotation.beta, -this.state.DeviceData.rotation.alpha) * 180 / Math.PI;// In degrees
var roll = Math.atan2(-this.state.DeviceData.rotation.gamma, -this.state.DeviceData.rotation.beta) * 180 / Math.PI;// In degrees

// console.log('yaw : '+yaw +" degrees");
// console.log('pitch : '+pitch +" degrees");
// console.log('roll : '+roll +" degrees");


let flightTime = Math.sqrt(Math.pow(xSpeed,2)+ Math.pow(ySpeed,2) + Math.pow(zSpeed,2)) 
console.log(xSpeed)


this.setState(prevState => ({
    flight: prevState.flightTime = flightTime
  }));



  
  if (ySpeed>3.75 || ySpeed*-1>3.75){
  console.log('------------------------');
console.log('y:' + ySpeed.toFixed(3));
console.log('x:' + xSpeed.toFixed(3));
console.log('z:' + zSpeed.toFixed(3));
console.log('------------------------');

   
    this.setState(prevState => ({
     xAccelerationDuring:xSpeed
  }))



 
   // speed = this.state.DeviceData.acceleration.x;
   setTimeout( ()=>this.detectLand(), 2000)
    

  }

   

  
  } 
 
  // Maybe only count as landed if x speed with is anything greater .5  of what it was before the y axis increase in speed or if is a max of .5 slower
    
  
}


detectLand = () =>{
  var xSpeed = this.state.DeviceData.acceleration.x;
  var ySpeed = this.state.DeviceData.acceleration.y;
  // console.log("1")
  // console.log("2")
  // speed = this.state.DeviceData.acceleration.x;
  // console.log("X BEFORE"+this.state.xAccelerationDuring)
  if (this.state.xAccelerationDuring<0){
    var percentage = (this.state.xAccelerationDuring/100*74)*-1;

  }
  else{
var percentage = this.state.xAccelerationDuring/100*74;

  }
  if (xSpeed<0){
    xSpeed = this.state.DeviceData.acceleration.x*-1; 
  }

console.log("X Before trick:"+ this.state.xAccelerationDuring)
  console.log("77% of x before : "+percentage);
  
  console.log("X after 2s Second :",xSpeed);
  if(xSpeed>percentage)
  {
  //if(xSpeed>0.65 || xSpeed*-1>0.65){
    console.log('------------------------');
    console.log('Trick has been landed');
    console.log('------------------------');
    
    console.log('------------------------');

    this.setState(prevState => ({
     
     
        trickAttempt: prevState.trickAttempt+1,
          trickCount: prevState.trickCount+1,
          streak: prevState.streak+1
        }));  
      
    
    
 


 }
 else if (xSpeed<percentage)
 { 
  console.log('------------------------');
  console.log('Trick has been Failed!!!');
  console.log('------------------------');

  console.log('------------------------');
  this.setState(prevState => ({
    trickAttempt: prevState.trickAttempt+1,
    fail: prevState.fails+1,
    streak: 0      
}))
}
this.setState(
  { started:false,
   })

setTimeout(()=> this.setState(
  { started:true,
    start:true}
),3000)


}
        



DeviceMotionSub = () => {
  this.d_sub = DeviceMotion.addListener((DeviceData) => {
    this.setState({DeviceData});
   this.detectTrick();
    
  });
}





componentDidMount() {
  this.DeviceMotionSub();
  this.setState(() => ({
           
       
     uid:Firebase.auth().currentUser.uid
    
}))
}




onSubmit = ()=>
{

var time = new Date();
this.setState(
  { started:false})
  this.setState({Date:time.toLocaleString('en-GB', { timeZone: 'UTC' })})
  const session= {uid: Firebase.auth().currentUser.uid,TrickType:this.state.TrickType, Lands:this.state.landed,
     Fails:this.state.fails, streak: this.state.Streak, Date:this.state.Date}
  sendTrickData(session);      
      
}


  render() {

    return (
      <View style={styles.container}>




         
    
      <ScrollView style={styles.containerStyle} >


      <Grid>
      <Row style={{ height:60,  justifyContent: 'center' }}>
        
      <Button onPress={
       
       ()=>{
        setTimeout(()=> this.setState(
          { started:true,
            start:true}
        ),3000)
        }} title="Start Session"/>

</Row>
      <Row style={{ height: 20,  justifyContent: 'center' }}>
        <Text style={{fontSize:16}}>One you start you will have 3 seconds to place
        </Text>

      </Row>
      <Row style={{ height: 20,  justifyContent: 'center' }}>
        <Text style={{fontSize:16}}>your phone in your pocket.  
        </Text></Row>
      <Row style={{ height: 20,  justifyContent: 'center' }}>
        <Text style={{fontSize:16}}>
          For best results please place your phone</Text>
      </Row>
      <Row style={{ height: 20,  justifyContent: 'center' }}>
        <Text style={{fontSize:16}}>
         in your front pocket</Text>
      </Row>

  
<Row style={{ height: 200,  justifyContent: 'center' }}>
  

  <Picker
                   selectedValue={this.state.filter}
                       style={{ height: 50, width: 150 }}
                       onValueChange={this.filter}
                                                
  
                           
                           >
   
    <Picker.Item label="Ollie" value="Ollie" />
    <Picker.Item label="Kickflip" value="Kickflip" />
    <Picker.Item label="Heelflip" value="Heelflip" /> 
  
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
        <Text> Fails : {this.state.fails}</Text>
      </Col>
      <Col style={{alignItems: 'center'}}>
<Text> Streak : {this.state.streak}</Text></Col>
</Row>
<Row style={{ height: 60,justifyContent: 'center' }}>
    <Button onPress={this.onSubmit}title="Save Session"/>
         
  </Row>
      </Grid>
     


  </ScrollView>

  </View>
  
     ); }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
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