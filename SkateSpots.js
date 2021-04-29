import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  Picker,
  Alert,
  TouchableHighlight,
} from "react-native";
import Polyline from "./node_modules/@mapbox/polyline";
import React from "./node_modules/react";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Geolocation from "./node_modules/expo-location";
import * as Permissions from "./node_modules/expo-permissions";
import Carousel from "./node_modules/react-native-snap-carousel";
import {
  getSpots,
  getMySpots,
  deleteSpot,
  getTime,
  updateSpeed,
} from "./SkateSpotsApi";
import Firebase from "./config/Firebase";
import ForecastCard from "./components/ForecastCard";
import {
  Card,
  Divider,
  Rating,
  withTheme,
} from "./node_modules/react-native-elements";
import { API_KEY } from "./config/WeatherAPIKey";

import { __await } from "./node_modules/tslib";

class Skatespots extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      drawerLabel: "Spots",
      drawerIcon: ({ tintColor }) => (
        <Image
          source={require("./images/icons8-skateboard-50.png")}
          style={[styles.icon, { tintColor: tintColor }]}
        />
      ),
    };
  };

  state = {
    Distance: null,
    User: {
      name: "",
      Speed: 0.0,
    },
    Avgspeed: [],
    counter: 0,
    defaultSpeed: 4.33629,
    Time: 0.0,
    speedLoc: {},
    locationResult: {},
    filter: "",
    markers: [],

    ovSpeed: 0.0,
    coordinates: [],
    newMarkers: [],
    weather: {
      temperature: 0,
      weatherCondition: null,
      description: null,
      icon: null,
      wind: null,
    },
    coords: [],
    modalVisible: false,
    interval: 0,
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  getLocationFromName(loc) {
    this.setState({
      newMarkers: [
        ...this.state.newMarkers,
        { name: loc.name, latitude: loc.lat, longitude: loc.lng },
      ],
    });
    const locations = {
      latitude: loc.lat,
      longitude: loc.lng,
    };
    this._map.animateToRegion({
      latitude: loc.lat,
      longitude: loc.lng,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    this.setState({ searchLocation: loc });
    const { modalVisible } = this.state;
    this.setModalVisible(true);
  }

  updateAverageSpeed = async () => {
    let location = await Geolocation.getCurrentPositionAsync({});
    console.log(JSON.stringify(location));
    this.setState({ speedLoc: JSON.stringify(location) });
    console.log(this.state.speedLoc);
    this.setState((prevState) => ({
      SpeedCounter: prevState.SpeedCounter + 1,
      CurrentSpeed: location.Speed,
    }));
    this.setState((prevState) => ({
      TotalSpeed: prevState.TotalSpeed + this.state.CurrentSpeed,
    }));
  };

  renderModal = (e) => {
    this.setState({
      newMarkers: [
        ...this.state.newMarkers,
        {
          name: "",
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
        },
      ],
    });

    this.props.navigation.navigate("SpotFormScreen", {
      spot: {
        name: "",
        longitude: e.nativeEvent.coordinate.longitude,
        latitude: e.nativeEvent.coordinate.latitude,
      },
      longitude: e.nativeEvent.coordinate.longitude,
      latitude: e.nativeEvent.coordinate.latitude,
    });
  };

  onSpotAdded = (coordinate) => {
    this.setState((prevState) => ({
      coordinates: [...prevState.coordinates, coordinate],
    }));

    this.props.navigation.popToTop();
  };

  onSpotsRecieved = (coordinates) => {
    this.setState((prevState) => ({
      coordinates: (prevState.coordinates = coordinates),
    }));

    console.log(coordinates);
  };

  onTimeRecieved = (Avgspeed) => {
    this.setState((prevState) => ({
      Avgspeed: (prevState.Avgspeed = Avgspeed),
    }));
  };

  componentDidMount() {
    this._getLocationAsync();

    getSpots(this.onSpotsRecieved);
    getTime(this.onTimeRecieved);
  }

  _handleMapRegionChange = (mapRegion) => {
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }

    let location = await Geolocation.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location) });

    let initialPosition = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    };

    this.setState({ initialPosition });
  };

  onMapPress = (e) => {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          longitude: e.nativeEvent.coordinate.longitude,
          latitude: e.nativeEvent.coordinate.latitude,
        },
      ],
    });
  };

  fetchWeather(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          weather: {
            temperature: json.main.temp,
            weatherCondition: json.weather[0].main,
            description: json.weather[0].description,
            icon: json.weather[0].icon,
            wind: json.wind.speed,
          },
        });
      });
  }

  renderOptions = (marker, index) => {
    this.state.markers[index].hideCallout();
    console.log(marker);
    if (marker.createdBy != Firebase.auth().currentUser.uid) {
      Alert.alert(
        "",
        "Alert",
        [
          {
            text: "Edit Spot",
            onPress: () =>
              this.props.navigation.navigate("EditScreen", {
                spot: {
                  id: marker.id,
                  name: marker.name,
                  longitude: marker.longitude,
                  latitude: marker.latitude,
                },
                longitude: marker.longitude,
                latitude: marker.latitude,
              }),
          },
          {
            text: "Get directions",
            onPress: () => this.onMarkerPressed(marker, index),
          },
          {
            text: "Get Weather",
            onPress: () => {
              this.state.markers[index].showCallout(),
                this.fetchWeather(marker.longitude, marker.latitude);
            },
          },

          {
            text: "Cancel",

            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "",
        "Alert",
        [
          {
            text: "Edit Spot",
            onPress: () =>
              this.props.navigation.navigate("EditScreen", {
                spot: {
                  id: marker.id,
                  name: marker.name,
                  longitude: marker.longitude,
                  latitude: marker.latitude,
                },
                longitude: marker.longitude,
                latitude: marker.latitude,
              }),
          },
          {
            text: "Get directions",
            onPress: () => this.onMarkerPressed(marker, index),
          },
          {
            text: "Get Weather",
            onPress: () => this.state.markers[index].showCallout(),
          },
          {
            text: "Delete Spot",
            onPress: () => deleteSpot(this.state.markers[index]),
          },

          {
            text: "Cancel",

            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  filter = (itemValue, itemIndex) => {
    this.setState({ filter: itemValue });

    if (itemValue === "All Spots") {
      getSpots(this.onSpotsRecieved);
    } else {
      getMySpots(this.onSpotsRecieved);
    }
  };

  renderCarouselItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Image style={styles.cardImage} source={{ uri: item.image }} />
    </View>
  );

  onCarouselItemChange = (index) => {
    if (index > 0) {
      this.state.markers[index - 1].hideCallout();
    } else {
      this.state.markers[index].hideCallout();
    }
    let location = this.state.coordinates[index];
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    this.fetchWeather(location.latitude, location.longitude);
  };

  onMarkerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
    this._carousel.snapToItem(index);
    console.log(
      this.state.initialPosition.longitude.toString() +
        "," +
        this.state.initialPosition.latitude.toString()
    );
    this.getDirections(
      this.state.initialPosition.latitude.toString() +
        "," +
        this.state.initialPosition.longitude.toString(),
      location.latitude.toString() + "," + location.longitude.toString()
    );
  };

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyCOVmY_-JN6AY1x5a80rXwTHgLXWtUdf5E`
      );

      let respJson = await resp.json();
      console.log(respJson);
      let distance = respJson.routes[0].legs[0].distance.value;
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ Distance: respJson.routes[0].legs[0].distance.text });
      let defspeed = this.state.defaultSpeed;
      if (this.state.Avgspeed[0].name === Firebase.auth().currentUser.uid) {
        let avgspeed = parseFloat(this.state.Avgspeed[0].Speed);

        let time = distance / avgspeed / 60;
        let timer = (time * 60000) / 5;
        console.log(timer);
        this.setState({ timer: timer });
        this.setState({ Time: time });
        console.log(time);
        this.setState({ coords: coords });

        this.setState({
          interval: setInterval(this.updateAverageSpeed, timer),
        });

        if (this.state.counter === 5) {
          clearInterval(this.state.interval);
          this.setState({ interval: null });
          const total = this.state.TotalSpeed;
          this.setState((prevState) => ({
            NewAverageSpeed: total / 5,
          }));
          let user = {
            name: Firebase.auth().currentUser.email,
            Speed: this.state.NewAverageSpeed,
          };
          updateSpeed(user);

          return coords;
        }
      } else {
        let time = distance / defspeed / 60;
        let timer = (time * 60000) / 5;
        this.setState({ timer: timer });
        this.setState({ Time: time });
        console.log(timer);
        this.setState({ coords: coords });

        this.setState({
          interval: setInterval(this.updateAverageSpeed, timer),
        });

        if (this.state.counter === 5) {
          clearInterval(this.state.interval);
          this.setState({ interval: null });
          const total = this.state.TotalSpeed;
          this.setState((prevState) => ({
            NewAverageSpeed: total / 5,
          }));
          let user = {
            name: Firebase.auth().currentUser.email,
            Speed: this.state.NewAverageSpeed,
          };
          updateSpeed(user);
        }

        return coords;
      }
    } catch (error) {
      alert(error);
      return error;
    }
  }

  render() {
    let time;
    const { modalVisible } = this.state;
    var hours = new Date().getHours();

    var minutes = new Date().getMinutes();

    time = hours + ":" + minutes;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={(map) => (this._map = map)}
            showsUserLocation={true}
            style={{ flex: 1 }}
            initialRegion={this.state.initialPosition}
            onLongPress={this.renderModal}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={styles.distance}>
                {" "}
                Distance to destination: {this.state.Distance}
              </Text>
              <Text style={styles.distance}>
                {" "}
                Estimated Journey time : {this.state.Time} minutes
              </Text>
            </View>

            <View>
              <Picker
                selectedValue={this.state.filter}
                style={{ height: 50, width: 100 }}
                onValueChange={this.filter}
              >
                <Picker.Item label="All Spots" value="All Spots" />
                <Picker.Item label="My Spots" value="My Spots" />
              </Picker>

              <View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
                >
                  <View>
                    <View>
                      <TouchableHighlight
                        style={{ backgroundColor: "#2196F3" }}
                        onPress={() =>
                          this.props.navigation.navigate("SpotFormScreen", {
                            spot: {
                              name: searchLocation.name,
                              longitude: searchLocation.lng,
                              latitude: searchLocation.lat,
                            },
                          })
                        }
                      >
                        <Text>Add Spot</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
            {this.state.newMarkers.map((marker, index) => (
              <Marker
                key={marker.name}
                onPress={() => this.renderOptions(marker, index)}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
              ></Marker>
            ))}

            {this.state.coordinates.map((marker, index) => (
              <Marker
                key={marker.name}
                ref={(ref) => (this.state.markers[index] = ref)}
                onPress={() => this.renderOptions(marker, index)}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
              >
                <Callout
                  onPress={() => this.state.markers[index].hideCallout()}
                  tooltip={true}
                >
                  <Card
                    containerStyle={
                      (styles.forcard, (opacity = this.state.opacity))
                    }
                  >
                    <Text style={styles.notes}>{this.state.location}</Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{ width: 100, height: 100 }}
                        source={{
                          uri:
                            "https://openweathermap.org/img/w/" +
                            this.state.weather.icon +
                            ".png",
                        }}
                      />
                      <Text style={styles.time}>{time}</Text>
                    </View>

                    <Divider
                      style={{ backgroundColor: "#dfe6e9", marginVertical: 20 }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.notes}>
                        {this.state.weather.description}
                      </Text>
                      <Text style={styles.notes}>
                        {Math.round(this.state.weather.temperature * 10) / 10}
                        &#8451;
                      </Text>
                    </View>
                  </Card>
                </Callout>
              </Marker>
            ))}

            <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={2}
              strokeColor="red"
            />
          </MapView>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            data={this.state.coordinates}
            containerCustomStyle={styles.carousel}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={150}
            removeClippedSubviews={false}
            onSnapToItem={(index) => this.onCarouselItemChange(index)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  search: {
    position: "absolute",
  },

  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: "absolute",
    bottom: 0,
    marginBottom: 24,
  },
  cardContainer: {
    backgroundColor: "rgba(0, 0,0, 0.6)",
    height: 100,
    width: 150,
    padding: 12,
    borderRadius: 12,
  },
  cardImage: {
    height: 60,
    width: 150,
    bottom: 0,
    position: "absolute",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    alignSelf: "center",
  },
  forcard: {
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
  distance: {
    backgroundColor: "#FFFFFF",
  },

  form: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
export default Skatespots;
