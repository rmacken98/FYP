import React from "react";
import { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, Card, Divider } from "react-native-elements";

export default class ForecastCard extends Component {
  render() {
    return (
      <Card containerStyle={styles.card}>
        <Text style={styles.notes}>{this.props.location}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>Hello</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: "https://openweathermap.org/img/w/" + ".png" }}
          />
          <Text style={styles.time}>16:00</Text>
        </View>

        <Divider style={{ backgroundColor: "#dfe6e9", marginVertical: 20 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.notes}></Text>
          <Text style={styles.notes}></Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(56, 172, 236, 1)",
    borderWidth: 0,
    borderRadius: 20,
  },
  time: {
    fontSize: 38,
    color: "#fff",
  },
  notes: {
    fontSize: 18,
    color: "#fff",
    textTransform: "capitalize",
  },
});
