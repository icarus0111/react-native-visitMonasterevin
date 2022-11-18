import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from "../components/auth/Login";
import RegisterationScreen from "../components/auth/Registeration";
import FeedbackScreen from "../components/map/Feedback";
import WalkingTrailScreen from "../components/map/WalkingTrail";
import WelcomeScreen from "../components/onboarding";
import ReportScreen from "../components/report";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registeration" component={RegisterationScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="WalkingTrail" component={WalkingTrailScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
    </Stack.Navigator>
  );
}

export default <MyStack />