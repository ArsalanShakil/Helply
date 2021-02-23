/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Card, ListItem, Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
        navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.sv}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        enabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.form}>
              <Card containerStyle={styles.card}>
                {formToggle ? (
                  <>
                    <Card.Title style={styles.title}>Login</Card.Title>
                    <LoginForm navigation={navigation} />
                  </>
                ) : (
                  <>
                    <Card.Title style={styles.title}>Register</Card.Title>
                    <RegisterForm navigation={navigation} />
                  </>
                )}
                <ListItem
                  onPress={() => {
                    setFormToggle(!formToggle);
                  }}
                  containerStyle={{
                    backgroundColor: '#FEFEF2',
                    borderWidth: 0,
                  }}
                >
                  <ListItem.Content>
                    <Text style={styles.text}>
                      {formToggle ? 'Sign Up?' : 'Login?'}
                    </Text>
                  </ListItem.Content>
                </ListItem>
              </Card>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sv: {
    flexGrow: 1,
    backgroundColor: '#f5e4d5',
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FEFEF2',
    borderColor: '#FEFEF2',
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  title: {
    color: '#0E2A25',
    fontSize: 40,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    marginBottom: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    color: '#445743',
    fontSize: 16,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
