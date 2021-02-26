/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext, useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';

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
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import OnboardingScreen from '../views/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';
import Search from '../views/Search';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerStyle={{
        backgroundColor: '#FEFEF2',
      }}
      drawerContentOptions={{
        activeTintColor: '#0E2A25',
        activeBackgroundColor: '#D4CCC4',
        inactiveTintColor: '#0E2A25',
      }}
      screenOptions={({route}) => ({
        drawerIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              color = '#0E2A25';
              break;
            case 'Profile':
              iconName = 'person-circle-outline';
              color = '#0E2A25';
              break;
            case 'Upload':
              iconName = 'add-circle-outline';
              color = '#0E2A25';

              break;
            case 'Search':
              iconName = focused ? 'search' : 'search';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Upload" component={Upload} />
      <Drawer.Screen name="Search" component={Search} />
    </Drawer.Navigator>
  );
};

const StackScreen = () => {
  // The code for ONBOARDINGSCREEN
  // id details not rendering on first launch

  // const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  /* useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []); */

  /*   if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
 */

  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={DrawerScreen}
            options={({navigation}) => ({
              headerTitle: '',
              headerStyle: {
                backgroundColor: '#FEFEF2',
              },
              headerTintColor: '#FEFEF2',
              headerTitleStyle: {
                fontWeight: 'normal',
              },

              headerRight: () => (
                <Button
                  onPress={() =>
                    alert('This functionality is not availble yet!')
                  }
                  title=""
                  icon={<Icon name="call-outline" size={30} color="#0E2A25" />}
                  iconRight
                  type="clear"
                />
              ),
              headerLeft: () => (
                <Button
                  // Need some work
                  onPress={() =>
                    navigation.dispatch(DrawerActions.toggleDrawer())
                  }
                  title=""
                  icon={
                    <Icon
                      name="menu-outline"
                      size={34}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                />
              ),
            })}
          />
          <Stack.Screen name="Modify" component={Modify} />
          <Stack.Screen name="My Files" component={MyFiles} />
          <Stack.Screen name="Single" component={Single} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="OnBoarding"
            component={OnboardingScreen}
            options={() => ({
              headerShown: false,
            })}
          />
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
  /* } else {
    return <Login />;
  } */
};
const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
