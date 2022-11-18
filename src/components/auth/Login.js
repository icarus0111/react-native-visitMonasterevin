import React, { Component } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { height, width } = Dimensions.get('window');

export default class LoginScreen extends Component {

  constructor() {
    super();
    this.state = {
      username_email: '',
      password: ''
    }
  }

  onLogin() {

    if (this.state.username_email == '') {
      this.refs.toast.show('Username or Email is empty');
    } else if (this.state.password == '') {
      this.refs.toast.show('Password is empty');
    } else {

      let loginFormData = new FormData();
      loginFormData.append('username', this.state.username_email)
      loginFormData.append('password', this.state.password)

      fetch('https://vm.somuchmarketing.com/aptest/api/user/generate_auth_cookie/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        body: loginFormData
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == 'ok') {
            this.props.navigation.navigate('Welcome')
          } else {
            this.refs.toast.show(responseJson.error)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  goRegister() {
    this.props.navigation.navigate('Registeration')
  }

  facebookLogin() {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (result.isCancelled) {
          this.refs.toast.show('Login cancelled')
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            let accessToken = data.accessToken.toString()
            this.getProfile(accessToken)
          })
        }
      },
      (error) => {
        console.log('Login fail with error: ' + error);
      }
    );
  }

  getProfile(token) {
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
      .then((response) => response.json())
      .then((responseJson) => {
        this.fbLogin(responseJson)
      })
      .catch((error) => {
        console.error(error);
      })
  }

  fbLogin(profile) {

    let loginFormData = new FormData();
    loginFormData.append('username', profile.email)
    loginFormData.append('password', 'Mine@111')

    fetch('https://vm.somuchmarketing.com/aptest/api/user/generate_auth_cookie/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      body: loginFormData
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'error') {
          this.get_nonce(profile)
        } else {
          this.props.navigation.navigate('Welcome')
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  get_nonce(profile) {

    let nonceFormData = new FormData();
    nonceFormData.append('controller', 'user');
    nonceFormData.append('method', 'register');

    fetch('https://vm.somuchmarketing.com/aptest/api/get_nonce/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      body: nonceFormData
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'ok') {
          this.fbRegister(profile, responseJson.nonce)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  fbRegister(profile, nonce) {

    let registerFormData = new FormData();
    registerFormData.append('username', profile.name);
    registerFormData.append('email', profile.email);
    registerFormData.append('user_pass', 'Mine@111');
    registerFormData.append('nonce', nonce);
    registerFormData.append('display_name', profile.name);

    fetch('https://vm.somuchmarketing.com/aptest/api/user/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      body: registerFormData
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'ok') {
          this.props.navigation.navigate('Welcome')
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
          <StatusBar hidden />
          <View style={styles.container}>
            <View style={styles.body}>
              <View style={styles.logoView}>
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
              </View>
              <View style={styles.formView}>
                <TextInput
                  style={styles.form}
                  placeholder='Username or Email'
                  onChangeText={(text) => this.setState({ username_email: text })}
                  value={this.state.username_email}
                  returnKeyType={'next'}
                  onSubmitEditing={() => { this.secondTextInput.focus() }} />
                <TextInput
                  ref={(input) => { this.secondTextInput = input }}
                  style={styles.form}
                  placeholder='Password'
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                  secureTextEntry />
                <TouchableOpacity style={[styles.authButton, { marginTop: 30 }]} onPress={() => this.onLogin()}>
                  <Text style={styles.authText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.authButton} onPress={() => this.goRegister()}>
                  <Text style={styles.authText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.facebookButton} onPress={() => this.facebookLogin()}>
                <View style={styles.facebookIconView}>
                  <FontAwesome name='facebook' size={25} color='#7BBFA0' />
                </View>
                <View style={styles.facebookTextView}>
                  <Text style={styles.facebookText}>LOGIN WITH FACEBOOK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Toast ref='toast' />
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height
  },
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  body: {
    flex: 7
  },
  logoView: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: 200,
    height: 120,
    resizeMode: 'contain'
  },
  formView: {
    flex: 1,
    alignItems: 'center'
  },
  form: {
    width: width * 0.8,
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ABCAE2',
    borderRadius: 25,
    paddingStart: 25,
    marginTop: 15,
    fontSize: 18,
    color: '#80BE83'
  },
  authButton: {
    width: width * 0.8,
    height: 50,
    backgroundColor: '#79BC82',
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  authText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'white'
  },
  bottomBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  facebookButton: {
    width: width * 0.8,
    height: 50,
    borderWidth: 2,
    borderColor: '#7EC087',
    borderRadius: 25,
    paddingStart: 25,
    paddingEnd: 25,
    flexDirection: 'row'
  },
  facebookIconView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  facebookTextView: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  facebookText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#7BBFA0'
  }
});