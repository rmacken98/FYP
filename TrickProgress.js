import React from "react";
import { Component} from "react";
import {
  StyleSheet,View,
} from "react-native";
import { getTrick} from "./SkateSpotsApi";
import DropDownPicker from "react-native-dropdown-picker";

import { VictoryPie} from "victory-native";
import Firebase from "./config/Firebase";
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

  };

  onTricksRecieved = (Trickdata)=>{
      this.setState(prevState => ({
        Trickdata: prevState.Trickdata = Trickdata
      }));
    }

  componentDidMount() {
    console.log(Firebase.auth().currentUser.uid);
    getTricks(this.onTricksRecieved, Firebase.auth().currentUser.uid);
    console.log(this.state.Trickdata)
  }

  render() {
    const tricksChart = new Array();
    for (const [key, value] of Object.entries(this.state.Trickdata)) {
      if (
        value.TrickType === this.state.trickSelected &&
        value.Date === this.state.selected
      ) {
        tricksChart.push({
          x: "Failed :" + value.Fails.toString(),
          y: value.Fails,
        });
        tricksChart.push({
          x: "Landed :" + value.Lands.toString(),
          y: value.Lands,
        });
      }
    }

    const dates = new Array();
    for (const [key, value] of Object.entries(this.state.Trickdata)) {
      if (value.TrickType === this.state.trickSelected) {
        dates.push({
          label: value.TrickType + " :" + value.Date,
          value: value.Date,
        });
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.c2}>
          <DropDownPicker
            items={this.state.trick}
            multiple={false}
            min={0}
            max={10}
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            onChangeItem={(item) =>
              this.setState({
                trickSelected: item.value,
              })
            }
            containerStyle={{ width: 150, height: 70 }}
            dropDownStyle={{ marginTop: 2 }}
          />
        </View>
        <DropDownPicker
          items={dates}
          multiple={false}
          min={0}
          max={10}
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
          onChangeItem={(item) =>
            this.setState({
              selected: item.value,
            })
          }
          containerStyle={{ width: 150, height: 70 }}
          dropDownStyle={{ marginTop: 2 }}
        />

        <VictoryPie
          data={tricksChart}
          animate={{ duration: 500 }}
          width={300}
          height={300} // x="Landed" y="Attempted"
          innerRadius={70}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
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

  header: {
    justifyContent: "center",
    margin: 10,
  },
  textContainerStyle: {
    margin: 30,
  },
  picker: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
});

export default TrickProgress;
