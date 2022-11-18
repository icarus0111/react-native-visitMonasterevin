import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LikeIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FeedbackScreen extends Component {

  constructor() {
    super();
    this.state = {}
  }

  goMap = () => {
    this.props.navigation.navigate('WalkingTrail')
  }

  onBookmark = () => {

  }

  onFavourite = () => {

  }

  render() {
    return (
      <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
        <View style={styles.container}>
          <View style={styles.dialog}>
            <View style={styles.circleView1}>
              <View style={styles.circleView2}>
                <LikeIcon name='like1' size={40} color='#76B87F' backgroundColor='#76B87F' />
              </View>
            </View>
            <Text style={styles.text1}>WELL DONE!</Text>
            <Text style={styles.text2}>You completed the heritage trail. {'\n'} We hope you enjoyed it! {'\n'} Share it!</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.touchableOpacity} onPress={this.goMap}>
                <Icon name='map-marker' size={25} color='#7ABE83' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchableOpacity} onPress={this.onBookmark}>
                <Icon name='bookmark' size={20} color='#7ABE83' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchableOpacity} onPress={this.onFavourite}>
                <Icon name='heart' size={20} color='#7ABE83' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground >
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
  circleView1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F8FBFC',
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleView2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text1: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '900',
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