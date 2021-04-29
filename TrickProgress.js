import React from "react";
import { Component} from "react";
import {
  StyleSheet,View,ScrollView,Text
} from "react-native";
import {getTricks} from "./SkateSpotsApi";
import DropDownPicker from "react-native-dropdown-picker";
import { VictoryPie,VictoryLabel} from "victory-native";
import Firebase from "./config/Firebase";
import {Col, Grid, Row } from 'react-native-easy-grid';

class TrickProgress extends Component {
  static navigationOptions = ({ navigation }) => {
    return {};
  };

  state = {
    trick: [
      { label: "Ollie", value: "Ollie" },
      { label: "Heelflip", value: "Heelflip" },
      { label: "KickFlip", value: "KickFlip" },
    ],
    Trickdata: [],
    percetange:"",
    landsText:"",
    new:[],
    failsText:"dddd"
  };

  formatChart =()=>{
    
  }

  onTricksRecieved = (Trickdata)=>{
      this.setState(prevState => ({
        Trickdata: prevState.Trickdata = Trickdata
      }));
    }

  componentDidMount() {
    getTricks(this.onTricksRecieved, Firebase.auth().currentUser.uid);
    console.log(this.state.Trickdata)
  }

  render() {
    let ccx=0;
    let tricksChart = new Array();
    let trickTotals = new Array();
    let lands="";
    let fails="";
    let totalFails=0;
    let totalLands=0;
    let totalAttempts=0;
    
    for (const [key, value] of Object.entries(this.state.Trickdata)) {
      if ( value.TrickType === this.state.trickSelected ){
        totalFails+=value.Fails
 totalLands+= value.Lands
 console.log(totalAttempts)
      }

      if (
        value.TrickType === this.state.trickSelected &&
        value.Date === this.state.selected
      ) {
        tricksChart=[]
        tricksChart.push({
          x: "Failed",
          y: value.Fails,
          streak: value.streak
        });
        tricksChart.push({
          x: "Landed",
          y: value.Lands,
          Attempts: value.Attempts
        });
     ccx = ((value.Lands/value.Attempts)*100).toFixed(0)
      lands = "You landed: " + value.Lands + " out of " + value.Attempts + " "+ value.TrickType+"s";
      fails = "Fails: " + value.Fails;
      console.log(ccx)
             
      }

    }
      if (  this.state.trickSelected  &&  "All Time" === this.state.selected){
        trickTotals.push({
          x: "Failed",
          y: totalFails,
          Attempts:totalAttempts
         
        });
        trickTotals.push({
          x: "Landed",
          y: totalLands,
         
        });
        tricksChart= trickTotals;
        ccx= ((trickTotals[1].y/(trickTotals[1].y +trickTotals[0].y))*100).toFixed(0)
        lands = "You landed: " + trickTotals[1].y + " out of " + (trickTotals[1].y +trickTotals[0].y) + " "+ this.state.trickSelected+"s";

        console.log(totalFails)
    console.log(trickTotals);
    
    }


    

    const dates = new Array();
    dates.push({
      label:"All Time",
      value: "All Time"
    })
    for (const [key, value] of Object.entries(this.state.Trickdata)) {
      if (value.TrickType === this.state.trickSelected) {
        dates.push({
          label: value.TrickType + " :" + value.Date,
          value: value.Date,
        });
      }
    }
    



   
    
       
    return (
      <ScrollView style={styles.containerStyle} >

       <Grid>
       <Row style={{ height:200,  justifyContent: 'center' }}>
          <DropDownPicker
          placeholder="Select a trick"
            items={this.state.trick}
            multiple={false}
            min={0}
            max={10}
            style={styles.picker}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            onChangeItem={(item) =>
              this.setState({
                trickSelected: item.value,
                selected:''
               
              })
            }
            containerStyle={{ width: 200, height: 70 }}
            dropDownStyle={{ marginTop: 2 }}
          />
          </Row>
          <Row style={{ height:200,  justifyContent: 'center' }}>
        <DropDownPicker
        placeholder="Choose a session"
          items={dates}
          multiple={false}
          min={0}
          max={10}
          style={styles.picker}
          onChangeItem={(item) =>{
            this.setState({
              selected: item.value,
              failsText:ccx,
              landsText:lands
            })
            tricksChart=[]
            console.log(this.state.failsText);
          }
          }
          containerStyle={{ width: 200, height: 70 }}
          dropDownStyle={{ marginTop: 3 }}
        />
        
        </Row>
        <Row style={{ height:300,  justifyContent: 'center' }}>

        <VictoryPie
          data={tricksChart}
          animate={{ duration: 500 }}
          colorScale={["gray", "purple" ]}
          width={300}

          height={300} // x="Landed" y="Attempted"
          innerRadius={70}
          
          labelComponent={
            <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 20 }}
          x={150} y={150}
          text={ccx + "%"} 
        />
          }
        />
        </Row>
        <Row style={{ height: 40,justifyContent: 'center' }}>
          <Col style={{alignItems: 'center'}}>
          <Text  style={{ fontSize: 20 }}>{lands}</Text>
          </Col>
       </Row>
       </Grid>
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  picker:{borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,},


  container: {
   // flexWrap: "wrap",
    flex: 1,
    padding: 23,
    backgroundColor: "#ecf0f1",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  c2: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: "#ecf0f1",
  },
});

export default TrickProgress;
