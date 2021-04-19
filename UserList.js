import React from './node_modules/react';
import { Component } from './node_modules/react';
import {
  StyleSheet,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { getUsers} from './SkateSpotsApi';
import { ListItem, Divider } from './node_modules/react-native-elements';
import { TouchableHighlight } from 'react-native-gesture-handler';

class UserList extends Component {
  static navigationOptions = ({ navigation }) => {

   

    return {
   
    }
  };

  state = {
    userList: [],
    selectedIndex: 0
  }

 

  onUsersReceived = (userList) => {
    this.setState(prevState => ({
      userList: prevState.userList = userList
    }));
  }

  componentDidMount() {
    getUsers(this.onUsersReceived);
  }

 

  render() {
    return this.state.userList.length > 0 ?
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.userList}
          ItemSeparatorComponent={() => <Divider style={{ backgroundColor: 'black' }} />}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <ListItem
                containerStyle={styles.listItem}
                title={item.name}
               
                titleStyle={styles.titleStyle}
                subtitleStyle={styles.subtitleStyle}
               
                onPress={() => {
                  this.setState(prevState => ({ selectedIndex: prevState.selectedIndex = index }))
                  this.props.navigation.navigate("MessageScreen", {userto: item })
                }
                }

              />
            );
          }
          }
        />
      
      </SafeAreaView> :
      <View style={styles.textContainer}>
        <Text style={styles.emptyTitle}>No Users found</Text>
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

export default UserList;