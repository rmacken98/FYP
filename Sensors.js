import React from 'react';
import {Component,useState, useEffect ,useCallback} from 'react';
import {Button} from './components/Button';
import { WebView } from 'react-native-webview';
import {
  StyleSheet,
  Text,
  View,
  Alert
  ,Picker,
  ScrollView, 
  Dimensions
} from 'react-native';
import { getTricks,sendTrickData} from './SkateSpotsApi';
import Firebase from "./config/Firebase";
import {
    Accelerometer,
  DeviceMotion,
    Gyroscope
  } from 'expo-sensors';
  import CountdownCircleTimer from 'react-native-countdown-circle-timer';
import {Col, Grid, Row } from 'react-native-easy-grid';
import {PieChart} from 'react-native-chart-kit';
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
      currentTrickSession:{
        trickAttempt:0,
        trickCount:0,
        streak:0,
        fails:0
      } ,  
      accelerometerData:{x: 0, y: 0, z: 0 },
      timerAfter:0,
      Barometer:{},
      xAccelerationDuring: 0,
      trickAttempt:0,
      trickCount:0,
      flightTime:0.0,
      filter:'',
      landed:false,
      streak:0,
      playing:false,
      wait:false,
      tutorials:["https://www.youtube.com/watch?v=arDVW-aWWys","https://www.youtube.com/watch?v=s-Tw11EZCv4",
      "https://www.youtube.com/watch?v=EZhbRmYHjlI" ],
 
      chartConfig : {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        decimalPlaces: 3,   
             useShadowColorFromDataset: false // optional
      },

      Olliedata : [
        {
          name: "Ollie lands",
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
      ],
      Kickflipdata : [
        {
          name: "Kickflip lands",
          number: 13,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Kickflip attempts",
          number: 40,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }
      ],
      
      Heelflipdata : [
        {
          name: "Heelflip lands",
          number: 5,
          color: "rgba(131, 167, 234, 1)",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Heelflip attempts",
          number: 32,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }
      ],
      data:[],
      started:false,
      datas:[
        
 { 
  TrickType:"Heelflip",
  Date:"25/12/22",
 Landed:24,
   Attempted:50},

   {
     TrickType:"KickFlip",
     Date:"25/12/22",
    Landed:14,
      Attempted:50},
      ],
      graph:[],
      dates:[
        {
          date:"05/04/21",
          
          HeelflipLands: 5,
          Heelflipattempts:32
          
        }
      ],
      session:{}
    }
  //   TrickType:"Heelflip",
  //   Date:"25/12/22",
  //  Landed:24,
  //    Attempted:50},
 
  //    {
  //      TrickType:"KickFlip",
  //      Date:"25/12/22",
  //     Landed:24,
  //       Attempted:50},
  // const arr = new Array();

  // for (const [key, value] of Object.entries(data)) {
  //   if(value.TrickType==="Tricktype" && value.date==Date){
  //   arr.push({x:"Attemped",y:value.Attempted});
  //   arr.push({x:"Landed",y:value.Landed});

  // }}



    // for (const [key, value] of Object.entries(data)) {
    //   if(value.TrickType==="Heelflip"){
    //   arr.push({x:value.Attempted,y:value.Landed});
    // }}
    


    renderDatePickers = (data)=>{
    
        <Picker
    
    
    selectedValue={this.state.selected}
    onValueChange={  (itemValue, itemIndex) =>{

      

    }}>
    {data.map((item, index) => {
        return (<Picker.Item label={item.date} value={item.date} key={index}/>) 
    })}
</Picker>
      
    }

    setGraph= (trickType, date)=>{

this.setState({graph:[]});

for (const [key, value] of Object.entries(data)) {
    if(value.TrickType===trickType && value.date==date){
    this.state.graph.push({x:"Attemped",y:value.Attempted});
    this.state.graph.push({x:"Landed",y:value.Landed});

  }}
}
    


      sleep =(ms) =>{
      return new Promise(resolve => setTimeout(resolve, ms));
    }
 
    onTricksRecieved = (tricks)=>{
     
        this.setState(prevState => ({
            tricks: prevState.data = tricks
            
        }));

       // console.log(messages)

    
    }

    setData= (data)=>{
     
      this.setState(prevState => ({
          data: prevState.data = data
          
      }));

     // console.log(messages)

  
  }
  

    filter = (itemValue, itemIndex) =>{
      this.setState({filter: itemValue});
      // store.dispatch(filter(itemValue))
  
  if(itemValue==="Ollie"){
    this.setData(this.state.Olliedata);
     // getTricks(this.onTricksRecieved,"Ollie");
    //  this.setGraph(itemValue);
  }
  else if(itemValue==="Kickflip") {
      //getTricks(this.onTricksRecieved, "Kickflip");
       this.setData(this.state.Kickflipdata);
      // this.setGraph(itemValue);
  }
  else if(itemValue==="Heelflip") {
   // getTricks(this.onTricksRecieved, "Heelflip");
    this.setData(this.state.Heelflipdata);

}
}

    MyPieChart = () => {
      return (
        <>
          <Text style={styles.header}>Pie Chart</Text>
          <PieChart
            data={this.state.data}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={this.state.chartConfig}
            accessor="number"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute //for the absolute number remove if you want percentage
          />
        </>
      );
    };

    

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

// // var alt =this.state.Barometer.relativeAltitude;
// if(ySpeed>2.8 || ySpeed<-2.8){

// // console.log('------------------------');
// //  console.log('Yaw: ' + yaw + "degrees");
// // console.log('y:' + ySpeed.toFixed(3));
// // console.log('x:' + xSpeed.toFixed(3));
// // console.log('z:' + zSpeed.toFixed(3));


// // console.log(alt.toFixed(3));
// console.log('------------------------');
// }
this.setState(prevState => ({
    flight: prevState.flightTime = flightTime
  }));



  
  if (ySpeed>2.8 || ySpeed*-1>2.8){
  
   
    this.setState(prevState => ({
     xAccelerationDuring:xSpeed
  }))
// console.log("Speed BEFORE"+this.state.xAccelerationDuring)
  
   
    console.log("1")
   console.log("2")
   // speed = this.state.DeviceData.acceleration.x;
   setTimeout( ()=>this.detectLand(), 2000)
    

  }

   

  
  } 
 
  // Maybe only count as landed if x speed with is anything greater .5  of what it was before the y axis increase in speed or if is a max of .5 slower
    
  
}


detectLand = () =>{
  var xSpeed = this.state.DeviceData.acceleration.x;
  var ySpeed = this.state.DeviceData.acceleration.y;
  console.log("1")
  console.log("2")
  // speed = this.state.DeviceData.acceleration.x;
  console.log("X BEFORE"+this.state.xAccelerationDuring)
var percentage = this.state.xAccelerationDuring/100*77;
var percentageminus= (this.state.xAccelerationDuring/100*77)*-1;
var XAccelerationMinus = this.state.DeviceData.acceleration.x*-1;
  console.log("77% of x before : "+percentage);
  
  console.log("X after 2s Second :",xSpeed);
  if(xSpeed>percentage || XAccelerationMinus >percentageminus)
  {
  //if(xSpeed>0.65 || xSpeed*-1>0.65){
    console.log('------------------------');
    console.log('Trick has been landed');
    console.log('------------------------');
    console.log('y:' + ySpeed.toFixed(3));
    console.log('x:' + xSpeed.toFixed(3));
    console.log('------------------------');
    this.setState(prevState => ({    currentTrickSession: {                   
      ...prevState.currentTrickSession,
        trickAttempt: prevState.trickAttempt+1,
        trickCount: prevState.trickCount+1,
        streak: prevState.streak+1    
      }
    }))
    

 


 }
 else if (xSpeed<percentage|| xSpeed*-1<percentage*-1 )
 { 
  console.log('------------------------');
  console.log('Trick has been Failed!!!');
  console.log('------------------------');
  console.log('y:' + ySpeed.toFixed(3));
  console.log('x:' + xSpeed.toFixed(3));
  console.log('------------------------');
  this.setState(prevState => ({
    currentTrickSession: {                   
        ...prevState.currentTrickSession,    
        trickAttempt: prevState.trickAttempt+1,
      fail: prevState.fails+1,
      streak: 0    
    }
}))
}}
        
    
ontTricksRecieved = (data)=>{
  // console.log(coordinates);
    this.setState(prevState => ({
        data: prevState.data = data
    }));
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




componentDidMount() {
  this.DeviceMotionSub();
  //getTricks(this.onTricksRecieved);

}







  render() {

    return (
      <View style={styles.container}>




          <Button onPress={
       
       ()=>{
        setTimeout(()=> this.setState(
          { started:true,
            start:true}
        ),3000)
        }} title="Start Session"/>
    
      <ScrollView style={styles.containerStyle} >



          
    
     
    

  

      <Grid>
      <Row style={{ height: 40,  justifyContent: 'center' }}>
        
      </Row>

<Row style={{ height: 240,  justifyContent: 'center' }}>
  

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
     
      </Col>
      <Col style={{alignItems: 'center'}}>
<Text> Streak : {this.state.streak}</Text></Col>
    </Row>


   
      </Grid>
      <Button onPress={()=> this.setState(
          { started:false})}title="Save Session"/>

      {/* <View style={styles.containerStyle}>
 
 
<this.MyPieChart></this.MyPieChart>
  </View> */}
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