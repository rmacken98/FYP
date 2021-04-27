import React from "react";
import { Component, useState, useEffect, useCallback } from "react";
import { Button } from "./components/Button";
import { WebView } from "react-native-webview";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Picker,
  ScrollView,
  Dimensions,
} from "react-native";
import { getTricks, sendTrickData } from "./SkateSpotsApi";
import Firebase from "./config/Firebase";
import DropDownPicker from "react-native-dropdown-picker";
import { Accelerometer, DeviceMotion, Gyroscope } from "expo-sensors";
import CountdownCircleTimer from "react-native-countdown-circle-timer";
import { Col, Grid, Row } from "react-native-easy-grid";
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";
class TrickProgress extends Component {
  static navigationOptions = ({ navigation }) => {
    return {};
  };

  state = {
    screenWidth: Dimensions.get("window").width,
    trick: [
      { label: "Ollie", value: "Ollie" },
      { label: "Heelflip", value: "Heelflip" },
      { label: "KickFlip", value: "KickFlip" },
    ],
    Trickdata: [],
    datas: [
      {
        TrickType: "Heelflip",
        Date: "25/12/22",
        Landed: 24,
        Attempted: 50,
      },

      {
        TrickType: "KickFlip",
        Date: "25/12/22",
        Landed: 14,
        Attempted: 50,
      },
      {
        TrickType: "KickFlip",
        Date: "21/12/22",
        Landed: 17,
        Attempted: 40,
      },
    ],

    chartData: [],
  };

  onTricksRecieved = (tricks) => {
    this.setState((prevState) => ({
      tricks: (prevState.data = tricks),
    }));

    // console.log(messages)
  };

  ontTricksRecieved = (Trickdata) => {
    // console.log(coordinates);
    this.setState((prevState) => ({
      Trickdata: (prevState.Trickdata = Trickdata),
    }));
  };

  componentDidMount() {
    getTricks(this.onTricksRecieved);
  }

  render() {
    const tricks = new Array();
    for (const [key, value] of Object.entries(this.state.datas)) {
      if (
        value.TrickType === this.state.trickSelected &&
        value.Date === this.state.selected
      ) {
        tricks.push({
          x: "Failed :" + value.Attempted.toString(),
          y: value.Attempted,
        });
        tricks.push({
          x: "Landed :" + value.Landed.toString(),
          y: value.Landed,
        });
      }
    }

    const dates = new Array();
    for (const [key, value] of Object.entries(this.state.datas)) {
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
          data={tricks}
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
