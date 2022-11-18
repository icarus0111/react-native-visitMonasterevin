import Geolocation from '@react-native-community/geolocation';
import haversine from "haversine";
import React, { Component } from 'react';
import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, Text, ToastAndroid, TouchableOpacity, Vibration, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import MapView, { AnimatedRegion, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const initialRegion = {
  latitude: 53.142778,
  longitude: -7.067743,
  latitudeDelta: 0.00922,
  longitudeDelta: 0.00922 * ASPECT_RATIO
}
const GOOGLE_MAPS_APIKEY = 'AIzaSyCKY-mQaV2BKfyrzoRodVpMb7AhICo4_1w';

export default class WalkingTrailScreen extends Component {

  constructor() {
    super();
    this.state = {
      showcase1: true,
      showcase2: true,
      bridges: [],
      coordinates: [
        { latitude: 53.142778, longitude: -7.067743, name: 'Moore’s Bridge' },
        { latitude: 53.143171, longitude: -7.067239, name: 'Crowe’s Bridge' },
        { latitude: 53.144226, longitude: -7.070295, name: 'The Station House Bridge' },
        { latitude: 53.162326, longitude: -7.055813, name: 'Mc Cartneys Bridge' },
        { latitude: 53.149667, longitude: -7.062132, name: 'Brook Bridge' },
        { latitude: 53.149667, longitude: -7.062132, name: 'Shepherd’s Bridge' },
        { latitude: 53.146173, longitude: -7.070385, name: 'Pass Bridge' },
        { latitude: 53.143078, longitude: -7.068002, name: 'The Drawbridge' },
        { latitude: 53.142913, longitude: -7.068944, name: 'The Aqueduct' },
        { latitude: 53.146209, longitude: -7.080021, name: 'Coughlan’s Bridge' },
        { latitude: 53.145036, longitude: -7.065592, name: 'The Railway Bridge' },
        { latitude: 53.142905, longitude: -7.071927, name: 'Dunne’s Bridge' },
        { latitude: 53.142632, longitude: -7.067768, name: 'The Bridge at Moores Lock' },
        { latitude: 53.134988, longitude: -7.073820, name: 'Clogheen Bridge' },
        { latitude: 53.137846, longitude: -7.064034, name: 'The Town Bridge' },
        { latitude: 53.138976, longitude: -7.064739, name: 'The Slip' }
      ],
      destination_name: '',
      excerpt: '',
      content: '',
      currentLocation: {},
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0
      })
    }
    this.mapView = null
    this.getBridges()
  }

  getBridges() {
    fetch('https://vm.somuchmarketing.com/aptest/wp-json/wp/v2/posts?per_page=100')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ bridges: responseJson })
        this.setState({ excerpt: this.state.bridges[0].excerpt.rendered, content: this.state.bridges[0].content.rendered })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    // this.getCurrentLocation()
    this.setState({ destination_name: this.state.coordinates[0].name })
    const { coordinate } = this.state;

    this.watchID = Geolocation.watchPosition(
      position => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        this.checkBridge(newCoordinate)

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  getCurrentLocation() {
    if (this.hasLocationPermission()) {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ currentLocation: position })
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log(error)
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
      );
    }
  }

  async hasLocationPermission() {

    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  checkBridge(newCoordinate) {
    for (let i = 0; i < this.state.coordinates.length; i++) {
      let distance = (this.state.coordinates[i].latitude - newCoordinate.latitude) * (this.state.coordinates[i].latitude - newCoordinate.latitude) + (this.state.coordinates[i].longitude - newCoordinate.longitude) * (this.state.coordinates[i].longitude - newCoordinate.longitude)
      if (distance < 0.000001 * 0.000001) {
        Vibration.vibrate(3000)
        this.refs.toast.show(this.state.coordinates[i].name, 5000)
      }
    }
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: initialRegion.latitudeDelta,
    longitudeDelta: initialRegion.longitudeDelta
  });

  goBack() {
    this.props.navigation.goBack()
  }

  onClose() {
    this.props.navigation.navigate('Feedback')
  }

  goNext1() {
    this.setState({ showcase1: false })
  }

  onClose1() {
    this.setState({ showcase1: true })
  }

  onUp() {
    this.setState({ showcase2: false })
  }

  onClose2() {
    this.setState({ showcase1: true })
  }

  onDown() {
    this.setState({ showcase2: true })
  }

  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  _onMarkerPress(index) {
    this.setState({ destination_name: this.state.coordinates[index].name })
    this.setState({ excerpt: this.state.bridges[index].excerpt.rendered, content: this.state.bridges[index].content.rendered })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={initialRegion}
          ref={c => this.mapView = c}
          style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        // onPress={this.onMapPress}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
          {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
            coordinate={{ "latitude": this.state.latitude, "longitude": this.state.longitude }}
            title={"Your Location"}
          />}
          {this.state.coordinates.map((coordinate, index) =>
            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate}
              onPress={this._onMarkerPress.bind(this, index)}>
              <Image source={require('../../assets/map_location.png')} />
            </MapView.Marker>
          )}
          {(this.state.coordinates.length >= 2) && (
            <MapViewDirections
              origin={this.state.coordinates[0]}
              waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
              destination={this.state.coordinates[this.state.coordinates.length - 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor="#7ABE83"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 20),
                    bottom: (height / 20),
                    left: (width / 20),
                    top: (height / 20),
                  }
                });
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR');
              }}
            />
          )}
        </MapView>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ position: 'absolute', top: 30, width: '90%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => this.goBack()}>
              <AntDesign name='arrowleft' size={30} color='#7ABE83' />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#7ABE83' }}>Waliking Trail</Text>
            <TouchableOpacity onPress={() => this.onClose()}>
              <AntDesign name='close' size={30} color='#7ABE83' />
            </TouchableOpacity>
          </View>
          <View style={{ width: '90%', height: '90%', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {
              this.state.showcase1
                ?
                <View style={{ width: '100%', height: 120, backgroundColor: '#7ABE83', padding: 20, flexDirection: 'row' }}>
                  <View style={{ flex: 4 }}>
                    <Text style={{ fontSize: 20, fontWeight: '300', color: 'white' }}>{this.state.destination_name}</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, fontWeight: '300', color: 'white' }}>Learn more about {this.state.destination_name}</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', paddingStart: 10 }}>
                    <TouchableOpacity style={{ width: 50, height: 50, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => this.goNext1()}>
                      <AntDesign name='arrowright' size={25} color='#7ABE83' />
                    </TouchableOpacity>
                  </View>
                </View>
                :
                this.state.showcase2
                  ?
                  <View style={{ width: '100%', backgroundColor: 'white', paddingStart: 10, paddingEnd: 10, flexDirection: 'column' }}>
                    <View style={{ borderBottomColor: '#F1F9FF', borderBottomWidth: 2, flexDirection: 'column' }}>
                      <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ marginTop: 10, fontSize: 18, }}>{this.state.destination_name}</Text>
                        <Image source={require('../../assets/map_mark.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                      </View>
                      <View style={{ height: 50, marginTop: 5 }}>
                        <View style={{ flex: 1, borderStartColor: '#F1F9FF', borderStartWidth: 3, flexDirection: 'row' }}>
                          <View style={{ flex: 2, padding: 5 }}>
                            <Text style={{ fontWeight: '300', color: '#7ABE83' }}>Built: 1890</Text>
                            <Text style={{ fontWeight: '300', color: '#7ABE83' }}>History:</Text>
                          </View>
                          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image source={require('../../assets/map_mark.png')} style={{ width: 60, height: 50, resizeMode: 'contain' }} />
                            <Image source={require('../../assets/map_mark.png')} style={{ width: 60, height: 50, resizeMode: 'contain' }} />
                            <Image source={require('../../assets/map_mark.png')} style={{ width: 60, height: 50, resizeMode: 'contain' }} />
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontSize: 12, color: 'black' }}>
                        {this.state.excerpt.replace(/<p>/g, '').replace(/<\/p>/g, '')}
                      </Text>
                      <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.onClose1()}>
                          <FontAwesome name='close' size={25} color='#7ABE83' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginStart: 20 }} onPress={() => this.onUp()}>
                          <FontAwesome name='chevron-up' size={25} color='#7ABE83' />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  :
                  <View style={{ width: '100%', backgroundColor: 'white', paddingStart: 10, paddingEnd: 10, flexDirection: 'column' }}>
                    <View style={{ borderBottomColor: '#F1F9FF', borderBottomWidth: 2, flexDirection: 'column' }}>
                      <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ marginTop: 10, fontSize: 18, }}>{this.state.destination_name}</Text>
                        <Image source={require('../../assets/map_mark.png')} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                      </View>
                      <View style={{ height: 50, marginTop: 5 }}>
                        <View style={{ flex: 1, borderStartColor: '#F1F9FF', borderStartWidth: 3, flexDirection: 'row' }}>
                          <View style={{ flex: 2, padding: 5 }}>
                            <Text style={{ fontWeight: '300', color: '#7ABE83' }}>Built: 1890</Text>
                            <Text style={{ fontWeight: '300', color: '#7ABE83' }}>History:</Text>
                          </View>
                          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Image source={require('../../assets/map_mark.png')} style={{ width: 60, height: 50, resizeMode: 'contain' }} />
                            <Image source={require('../../assets/map_mark.png')} style={{ width: 60, height: 50, resizeMode: 'contain' }} />
                            <Image source={require('../../assets/map_mark.png')} style={{ width: 60, height: 50, resizeMode: 'contain' }} />
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={{ padding: 10 }}>
                      <ScrollView style={{ maxHeight: height * 0.65 }}>
                        <Text style={{ fontSize: 12, color: 'black' }}>
                          {this.state.content.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br \/>/g, '').replace(/\n/g, ' ').replace(/\. /g, '.\n')}
                        </Text>
                      </ScrollView>
                      <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <TouchableOpacity onPress={() => this.onClose2()}>
                          <FontAwesome name='close' size={25} color='#7ABE83' />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginStart: 20 }} onPress={() => this.onDown()}>
                          <FontAwesome name='chevron-down' size={25} color='#7ABE83' />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
            }
          </View>
        </View>
        <Toast ref="toast" />
      </View>
    );
  }

}