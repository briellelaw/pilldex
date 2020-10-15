import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SignInScreen from '../screens/SignInScreen.js';

const Stack = createStackNavigator();

function LoginStack ( ) {
    return (
        <Stack.Navigator intialRouteName = 'SignIn'
                         screenOptions={{
                             headerShown: false
                         }}>
          <Stack.Screen name='SignIn' component={SignInScreen}/>
        </Stack.Navigator>
      );
}

export default LoginStack;
