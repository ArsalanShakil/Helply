import React, {useContext, useState} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import FormTextInput from './FormTextInput';
import useLoginForm from '../hooks/LoginHooks';

const LoginForm = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {inputs, handleInputChange} = useLoginForm();
  const {postLogin} = useLogin();
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  const doLogin = async () => {
    setLoading(true);
    try {
      const userData = await postLogin(inputs);
      setIsLoggedIn(true);
      setUser(userData.user);
      await AsyncStorage.setItem('userToken', userData.token);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('postLogin error', error.message);
      Alert.alert('Invalid username or password');
    }
  };

  return (
    <View>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        inputContainerStyle={styles.inputText}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        inputContainerStyle={styles.inputText}
      />
      <Button
        title="Login"
        onPress={doLogin}
        loading={loading}
        buttonStyle={styles.button}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  inputText: {
    borderColor: '#D4CCC4',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 16,
    height: 55,
  },
  button: {
    backgroundColor: '#0E2A25',
    marginTop: 71,
    width: 179,
    height: 57,
    borderRadius: 10,
    marginHorizontal: '20%',
    marginBottom: 20,
  },
});

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;
