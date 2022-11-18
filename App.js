/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import LoginScreen from "./src/components/auth/Login";
import RegisterationScreen from "./src/components/auth/Registeration";
import FeedbackScreen from "./src/components/map/Feedback";
import WalkingTrailScreen from "./src/components/map/WalkingTrail";
import WelcomeScreen from "./src/components/onboarding";
import ReportScreen from "./src/components/report";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registeration" component={RegisterationScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WalkingTrail" component={WalkingTrailScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
    </Stack.Navigator>
  );
}

console.disableYellowBox = true

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}