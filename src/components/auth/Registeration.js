import React, { Component } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-easy-toast';

const { height, width } = Dimensions.get('window');

export default class RegisterationScreen extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: '',
      c_password: ''
    }
  }

  onRegister() {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(this.state.email) === false) {
      this.refs.toast.show('Email is not valid');
    } else if (this.state.password.length < 6) {
      this.refs.toast.show('Password is too short')
    } else if (this.state.password != this.state.c_password) {
      this.refs.toast.show('Not match passwords')
    } else {
      this.get_nonce()
    }
  }

  get_nonce() {

    let nonceFormData = new FormData();
    nonceFormData.append('controller', 'user');
    nonceFormData.append('method', 'register');

    fetch('https://vm.somuchmarketing.com/aptest/?json=get_nonce', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      body: nonceFormData
    }).then((response) => response.json())
      .then((responseJson) => {
        this.register(responseJson)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  register(response) {

    if (response.status == "ok") {

      let registerFormData = new FormData();
      registerFormData.append('username', this.state.username);
      registerFormData.append('email', this.state.email);
      registerFormData.append('user_pass', this.state.password);
      registerFormData.append('nonce', response.nonce);
      registerFormData.append('display_name', this.state.username);

      fetch('https://vm.somuchmarketing.com/aptest/?json=user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        body: registerFormData
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status == "ok") {
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

  goLogin() {
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
        <ScrollView style={{ flex: 1 }}>
          <StatusBar hidden />
          <View style={styles.container}>
            <View style={styles.body}>
              <View style={styles.logoView}>
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
              </View>
              <View style={styles.formView}>
                <TextInput
                  style={styles.form}
                  placeholder='Username'
                  onChangeText={(text) => this.setState({ username: text })}
                  value={this.state.username}
                  returnKeyType={'next'}
                  onSubmitEditing={() => { this.secondTextInput.focus() }} />
                <TextInput
                  ref={(input) => { this.secondTextInput = input }}
                  style={styles.form}
                  placeholder='Email'
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                  returnKeyType={'next'}
                  onSubmitEditing={() => { this.thirdTextInput.focus(); }} />
                <TextInput
                  ref={(input) => { this.thirdTextInput = input }}
                  style={styles.form}
                  placeholder='Password'
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                  secureTextEntry
                  returnKeyType={'next'}
                  onSubmitEditing={() => { this.fourthTextInput.focus() }} />
                <TextInput
                  ref={(input) => { this.fourthTextInput = input }}
                  style={styles.form}
                  placeholder='Confirm Password'
                  onChangeText={(text) => this.setState({ c_password: text })}
                  value={this.state.c_password}
                  secureTextEntry />
                <TouchableOpacity style={[styles.authButton, { marginTop: 30 }]} onPress={() => this.onRegister()}>
                  <Text style={styles.authText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.authButton} onPress={() => this.goLogin()}>
                  <Text style={styles.authText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Toast ref="toast" />
        </ScrollView>
      </ImageBackground>
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
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  authText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'white'
  }
});