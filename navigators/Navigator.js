/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext, useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';

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
          return <Icon name={iconName} size={60} color={color} />;
        },
      })}
      accessible={true}
      accessibilityLabel="Navigation drawer"
      accessibilityHint="Shows list of options to navigate between screens"
      accessibilityRole="menubar"
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        accessible={true}
        accessibilityLabel="Home Sceern"
        accessibilityHint="Shows list of posts"
        accessibilityRole="menuitem"
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        accessible={true}
        accessibilityLabel="Profile Screen"
        accessibilityHint="Shows information about your id"
        accessibilityRole="menuitem"
      />
      <Drawer.Screen
        name="Upload"
        component={Upload}
        accessible={true}
        accessibilityLabel="Upload Screen"
        accessibilityHint="Shows list of options to create post"
        accessibilityRole="menuitem"
      />
      <Drawer.Screen
        name="Search"
        component={Search}
        accessible={true}
        accessibilityLabel="Search Screen"
        accessibilityHint="Shows a input search field to search your posts"
        accessibilityRole="menuitem"
      />
    </Drawer.Navigator>
  );
};

const StackScreen = () => {
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
                  icon={<Icon name="call-outline" size={55} color="red" />}
                  iconRight
                  type="clear"
                  accessible={true}
                  accessibilityLabel="Call Button"
                  accessibilityHint="Lets you call the operator"
                  accessibilityRole="button"
                />
              ),
              headerLeft: () => (
                <Button
                  onPress={() =>
                    navigation.dispatch(DrawerActions.toggleDrawer())
                  }
                  title=""
                  icon={
                    <Icon
                      name="menu-outline"
                      size={60}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                  accessible={true}
                  accessibilityLabel="Menu Button"
                  accessibilityHint="Lets you open the menu drawer"
                  accessibilityRole="button"
                />
              ),
            })}
          />
          <Stack.Screen
            name="Modify"
            component={Modify}
            options={{
              title: 'Edit post',
              headerStyle: {
                backgroundColor: '#FEFEF2',
              },
              headerTintColor: '#0E2A25',
              headerTitleStyle: {},
            }}
          />
          <Stack.Screen
            name="My Files"
            component={MyFiles}
            options={{
              title: 'My Posts',
              headerStyle: {
                backgroundColor: '#FEFEF2',
              },
              headerTintColor: '#0E2A25',
              headerTitleStyle: {},
            }}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              title: '',
              headerStyle: {
                backgroundColor: '#FEFEF2',
              },
              headerTintColor: '#0E2A25',
              headerTitleStyle: {},
            }}
          />
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
};
const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
