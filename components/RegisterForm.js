import React from 'react';
import {Alert, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {useLogin, useUser} from '../hooks/ApiHooks';
import useSignUpForm from '../hooks/RegisterHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterForm = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm();
  const {postRegister} = useUser();
  const {postLogin} = useLogin();

  const doRegister = async () => {
    if (!validateOnSend()) {
      Alert.alert('Input validation failed!');
      console.log('validate on send failed');
      return;
    }
    delete inputs.confirmPassword;
    try {
      const result = await postRegister(inputs);
      console.log('doRegister ok', result.message);
      Alert.alert(result.message);
      // do automatic login after registering
      const userData = await postLogin(inputs);
      await AsyncStorage.setItem('userToken', userData.token);
      setIsLoggedIn(true);
      setUser(userData.user);
    } catch (error) {
      console.log('registration error', error);
      Alert.alert(error.message);
    }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          // console.log(event.nativeEvent.text);
          checkUserAvailable(event);
          handleInputEnd('username', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.username}
        inputContainerStyle={styles.inputText}
      />
      <Input
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={(event) =>
          handleInputEnd('password', event.nativeEvent.text)
        }
        secureTextEntry={true}
        errorMessage={registerErrors.password}
        inputContainerStyle={styles.inputText}
      />
      <Input
        autoCapitalize="none"
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        onEndEditing={(event) =>
          handleInputEnd('confirmPassword', event.nativeEvent.text)
        }
        secureTextEntry={true}
        errorMessage={registerErrors.confirmPassword}
        inputContainerStyle={styles.inputText}
      />
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) =>
          handleInputEnd('email', event.nativeEvent.text)
        }
        errorMessage={registerErrors.email}
        inputContainerStyle={styles.inputText}
      />
      <Input
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        onEndEditing={(event) =>
          handleInputEnd('full_name', event.nativeEvent.text)
        }
        errorMessage={registerErrors.full_name}
        inputContainerStyle={styles.inputText}
      />
      <Button
        title="Register!"
        onPress={doRegister}
        buttonStyle={styles.button}
        icon={<Icon name="checkmark-circle" size={25} color="#0E2A25" />}
        iconRight
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
    marginTop: 20,
    width: 179,
    height: 57,
    borderRadius: 10,
    marginHorizontal: '20%',
    marginBottom: 20,
    paddingLeft: 32,
  },
});
RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
