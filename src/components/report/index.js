import React, { Component } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ReportScreen extends Component {

  constructor() {
    super();
    this.state = {}
  }

  render() {
    return (
      <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
        <View style={styles.container}>
          <View style={styles.dialog}>
            <Image source={require('../../assets/logo.png')} style={{ marginTop: 100 }} />
            <Text style={styles.text1}>Sponsored By</Text>
            <Text style={styles.text2}>This is a communitie based App. {'\n'} To help fund and support it please support {'\n'} our sponsors</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.touchableOpacity}>
                <Icon name='map-marker' size={25} color='#7ABE83' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchableOpacity}>
                <Icon name='bookmark' size={20} color='#7ABE83' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchableOpacity}>
                <Icon name='heart' size={20} color='#7ABE83' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialog: {
    width: '90%',
    height: '85%',
    backgroundColor: '#E7F0F5',
    borderRadius: 10,
    alignItems: 'center'
  },
  text1: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: '700',
    color: '#7ABE83'
  },
  text2: {
    marginTop: 10,
    fontSize: 16,
    color: '#7ABE83',
    textAlign: 'center',
    lineHeight: 25
  },
  buttonGroup: {
    width: '80%',
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  touchableOpacity: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderColor: '#BCE0FD',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});