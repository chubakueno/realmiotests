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
  Button,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

import Realm from 'realm';
import images from './images';
const PersonSchema = {
  name: 'Person',
  primaryKey: 'name',
  properties: {
    name: 'string',
    dogs: {type: 'linkingObjects', objectType: 'Dog', property: 'owner'}
  }
}

const DogSchema = {
  name:'Dog',
  primaryKey: 'name',
  properties: {
    name: 'string',
    owner: 'Person',
  }
}
export default class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        realm: null,
        dogName: '',
        dogOwner: '',
        personName: '',
      };
  }
  componentWillMount() {
    Realm.open({
      schema: [PersonSchema,DogSchema]
    }).then(realm => {
      this.setState({ realm });
    });
  }
  agregarPerro(){
    if(this.state.dogName.length==0){
        alert('El perro debe tener nombre');
        return;
    }
    let persona = this.state.realm.objects('Person').filtered(`name == '${this.state.dogOwner}'`);
    if(persona.length==0){
        alert(`No existe la persona '${this.state.dogOwner}'`);
        return;
    }
    persona = persona[0];
    console.log(persona);
    try{
        this.state.realm.write(() => {
            this.state.realm.create('Dog', {name: this.state.dogName, owner: persona});
        });
    } catch (e) {
       alert('Ya existe un perro con el mismo nombre');
    }
    this.forceUpdate();
  }
  agregarPersona(){
    if(this.state.personName.length==0){
        alert('La persona debe tener nombre');
        return;
    }
    try{
        this.state.realm.write(() => {
            this.state.realm.create('Person', {name: this.state.personName});
        });
    } catch (e) {
       alert('Ya existe un perro con el mismo nombre');
    }
    this.forceUpdate();
  }
  eliminarPerro(item){
    this.state.realm.write(() => {
        this.state.realm.delete(item);
    });
    this.forceUpdate();
  }
  eliminarPersona(item){
    if(item.dogs.length>0){
        alert('La persona posee perros, no es posible eliminarla');
        return;
    }
    this.state.realm.write(() => {
        this.state.realm.delete(item);
    });
    this.forceUpdate();
  }
  renderDog({item,index}){
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, padding: 5}}>
                <Text>{item.name}</Text>
                <Text>{item.owner.name}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.eliminarPerro.call(this,item)}>
                <Image source={images.delete} style={{width: 30, height: 30}}/>
            </TouchableOpacity>
        </View>
    )
  }
  renderPerson({item,index}){
    return (
        <View style={{flexDirection: 'row', padding: 5}}>
            <Text style={{flex: 1}}>{item.name}</Text>
            <TouchableOpacity onPress={()=>this.eliminarPersona.call(this,item)}>
                <Image source={images.delete} style={{width: 30, height: 30}}/>
            </TouchableOpacity>
        </View>
    )
  }
  _keyExtractor(item, index){
      return index;
  }
  itemSeparator(){
    return <View style={{height: StyleSheet.hairlineWidth, backgroundColor: 'gray'}}/>
  }
  addTest(){
    return new Promise((resolve, reject) => {
        let {realm} = this.state;
        try{
            realm.write(()=>{
                realm.delete(realm.objects('Dog'));
                realm.delete(realm.objects('Person'));
            });
            this.setState({
                dogName: 'Bobbie',
                dogOwner: 'Bob',
                personName: 'Bob'
            },()=>{
                this.agregarPersona();
                this.agregarPerro();
                resolve('OK!');
            });
        } catch(e){
            reject();
        }
    });
  }
  deleteTest(){
    return new Promise((resolve, reject) => {
        let {realm} = this.state;
        try{
            realm.write(()=>{
                realm.delete(realm.objects('Dog'));
                realm.delete(realm.objects('Person'));
            });
            this.setState({
                dogName: '',
                dogOwner: '',
                personName: ''
            },()=>{
                this.forceUpdate();
                resolve('OK!');
            });
        } catch(e){
            reject();
        }
    });
  }
  async runTests(){
    try{
        let addResult = await this.addTest.bind(this)();
        let deleteResult = await this.deleteTest.bind(this)();
    } catch(e){
        console.log(e);
        alert('Error en los tests, revisar el log');
    }
    return;
  }
  render() {
    const infoDogs = this.state.realm
      ? 'Number of dogs: ' + this.state.realm.objects('Dog').length
      : 'Loading...';
    const infoPeople = this.state.realm
      ? 'Number of persons: ' + this.state.realm.objects('Person').length
      : 'Loading...';
    let dogs = this.state.realm?this.state.realm.objects('Dog'):[];
    let people = this.state.realm?this.state.realm.objects('Person'):[];
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <Text>
                {infoDogs}
                </Text>
                <FlatList
                    data={dogs}
                    ItemSeparatorComponent={this.itemSeparator}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderDog.bind(this)}
                />
                <Button title = 'Agregar' onPress={this.agregarPerro.bind(this)}/>
                <TextInput
                    value={this.state.dogName}
                    onChangeText={(dogName)=>this.setState({dogName})}
                />
                <TextInput
                    value={this.state.dogOwner}
                    onChangeText={(dogOwner)=>this.setState({dogOwner})}
                />
            </View>
            <View style={{flex: 1}}>
                <Text>
                {infoPeople}
                </Text>
                <FlatList
                    data={people}
                    ItemSeparatorComponent={this.itemSeparator}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderPerson.bind(this)}
                />
                <Button title = 'Agregar' onPress={this.agregarPersona.bind(this)}/>
                <TextInput
                    value={this.state.personName}
                    onChangeText={(personName)=>this.setState({personName})}
                />
                <View style={{height: 49}}/>
            </View>
        </View>
        <Button
            title='Correr pruebas!'
            onPress={this.runTests.bind(this)}
            color='green'
        />
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
