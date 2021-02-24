/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext, useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from 'react-native-elements';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import OnboardingScreen from '../views/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Profile':
              iconName = 'account-box';
              break;
            case 'Upload':
              iconName = 'cloud-upload';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Upload" component={Upload} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  /*   const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);
 */
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isFirstLaunch ? (
        <>
          <Stack.Screen
            name="onBoardingScreen"
            component={OnboardingScreen}
            options={() => ({
              headerShown: false,
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login2"
            component={Login}
            options={() => ({
              headerShown: false,
            })}
          />
        </>
      )}

      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabScreen}
            options={({route}) => ({
              headerTitle: getFocusedRouteNameFromRoute(route),
            })}
          />
          <Stack.Screen name="Modify" component={Modify} />
          <Stack.Screen name="My Files" component={MyFiles} />
          <Stack.Screen name="Single" component={Single} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={() => ({
              headerShown: false,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
