import React, { Component } from 'react';
import { Alert, BackHandler, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';

export default class WelcomeScreen extends Component {

  constructor() {
    super();
    this.state = {
      bridges: []
    }
    this.getBridges()
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => BackHandler.addEventListener('hardwareBackPress', this.backPressed))
    this.props.navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', this.backPressed))
  }

  backPressed = () => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false });
    return true
  }

  getBridges() {
    fetch('https://vm.somuchmarketing.com/aptest/api/get_recent_posts/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ bridges: responseJson.posts })
      })
      .catch((error) => { console.error(error) });
  }

  onStart() {
    this.props.navigation.navigate('WalkingTrail')
  }

  render() {

    const bridges = this.state.bridges.map(bridge => {
      if (bridge.id == 117) {
        return (
          <ImageBackground key={bridge.id} source={{ uri: bridge.thumbnail }} style={styles.body} >
            <LinearGradient colors={['#848484', 'transparent']} style={styles.linearGradient}>
              <Text style={styles.text1}>Welcome to {'\n'}Our Walking Trail</Text>
              <Text style={styles.text2}>
                Simply continue around fantastic bridge trail as you pass certain points we will show you history of various points along the way...
              </Text>
              <Text style={styles.text3}>Enjoy!</Text>
            </LinearGradient>
          </ImageBackground>
        )
      } else {
        return (
          <ImageBackground key={bridge.id} source={{ uri: bridge.thumbnail }} style={styles.body} />
        )
      }
    })

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Swiper key={this.state.bridges.length} style={{ alignItems: 'center' }} dotColor='white' activeDotColor='#7ABE83'>
            {bridges}
          </Swiper>
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.startButton} onPress={() => this.onStart()}>
            <Text style={styles.startText}>LET'S START</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  linearGradient: {
    flex: 1
  },
  text1: {
    marginTop: 80,
    fontSize: 32,
    fontWeight: '300',
    color: 'white',
    textAlign: 'center'
  },
  text2: {
    marginTop: 20,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 25
  },
  text3: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center'
  },
  body: {
    flex: 7
  },
  bottomBar: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  startButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#7ABE83',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'white'
  }
});