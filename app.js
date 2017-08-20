/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button
} from 'react-native';

export default class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        cars: [],
        owners: [],
      };
  }
  agregar(){
    let object = {
        data: 'Civic',
        timestamp: 100*(new Date().getTime()+Math.random())
    };
    this.setState({
        cars: this.state.cars.concat([object])
    })
  }
  renderCar({item,index}){
    return (
        <Text>{item.data}</Text>
    )
  }
  _keyExtractor(item, index){
      return item.timestamp;
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
            <FlatList
                data={this.state.cars}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderCar.bind(this)}
            />
            <Button title = 'Agregar' onPress={this.agregar.bind(this)}/>
        </View>
        <View style={{flex: 1}}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
