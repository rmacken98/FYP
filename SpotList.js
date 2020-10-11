import React, { Component } from './node_modules/react';
import {
  StyleSheet,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  View,
  Alert
} from 'react-native';
import { getSpots} from './SkateSpotsApi';
import { ListItem, Divider } from './node_modules/react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';

class SpotList extends Component {
  static navigationOptions = ({ navigation }) => {

   

    return {
   
    }
  };

  state = {
    spotList: [],
    selectedIndex: 0
  }

 

  onSpotsReceived = (spotList) => {
    this.setState(prevState => ({
      spotList: prevState.spotList = spotList
    }));
  }

  componentDidMount() {
    getSpots(this.onSpotsReceived);
  }

 

  render() {
    return this.state.spotList.length > 0 ?
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.spotList}
          ItemSeparatorComponent={() => <Divider style={{ backgroundColor: 'black' }} />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            i= item.image
            console.log(i)
            return (
               
              <ListItem
                containerStyle={styles.listItem}
                title={item.name}
                leftAvatar= {{uri :i}}
                titleStyle={styles.titleStyle}
                subtitleStyle={styles.subtitleStyle}
               
                onPress={() => {
                  this.setState(prevState => ({ selectedIndex: prevState.selectedIndex = index }))
                  Alert.alert(
                    '',
                    'Alert',
                    [
                      {text: 'Edit Spot', onPress: () => this.props.navigation.navigate("SpotFormScreen2", {spot: {name:marker.name,longitude:  marker.longitude, latitude:  marker.latitude}
                      ,longitude:  marker.longitude, latitude:  marker.latitude})
                    },
                        {
                            text: 'Get directions',
                            onPress: () => this.onMarkerPressed(marker,index),
                           
                          },
                          {
                            text: 'Cancel',
                           
                            style: 'cancel',
                          },
                    
                      
                    ],
                    {cancelable: false},
                  );
                 
                }
                }

              />
            );
          }
          }
        />
      
      </SafeAreaView> :
      <View style={styles.textContainer}>
        <Text style={styles.emptyTitle}>No Spots found</Text>
        <Text style={styles.emptySubtitle}>Add a new user using the + button below</Text>
       
      </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 30
  },
  subtitleStyle: {
    fontSize: 18
  },
  emptyTitle: {
    fontSize: 32,
    marginBottom: 16
  },
  emptySubtitle: {
    fontSize: 18,
    fontStyle: 'italic'
  }
});

export default SpotList;