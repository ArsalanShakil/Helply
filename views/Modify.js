import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import Icon from 'react-native-vector-icons/Ionicons';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  } = useUploadForm();

  const doUpdate = async () => {
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file.file_id, inputs, userToken);
      // console.log('update response', resp);
      setUpdate(update + 1);
      navigation.pop();
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    setInputs({
      title: file.title,
    });
  }, []);

  const doReset = () => {
    reset();
  };
  return (
    <ScrollView style={{backgroundColor: '#FEFEF2'}}>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card containerStyle={styles.card}>
          <Text
            h4
            style={{color: '#0E2A25'}}
            accessible={true}
            accessibilityLabel="Update the post info"
            accessibilityHint="Lets you edit the post"
            accessibilityRole="text"
          >
            Update file info
          </Text>
          {/* TODO: add similar media view than Single.js */}
          <Input
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
            inputContainerStyle={{borderBottomWidth: 0.5, padding: 16}}
            accessible={true}
            accessibilityLabel="Edit title"
            accessibilityHint="Edit the title of the post"
          />

          {isUploading && <ActivityIndicator size="large" color="#0E2A25" />}

          <Button
            title="Update"
            onPress={doUpdate}
            icon={
              <Icon
                name="checkmark-done-outline"
                size={30}
                color="#FEFEF2"
                fontWeight="bold"
              />
            }
            iconLeft
            titleStyle={{
              paddingLeft: 16,
              color: '#FEFEF2',
            }}
            buttonStyle={{
              backgroundColor: '#0E2A25',
              borderRadius: 4,
              marginTop: 16,
            }}
            accessible={true}
            accessibilityLabel="Update"
            accessibilityHint="Updates the cahnges to title of the post"
            accessibilityRole="button"
          />
          <Button
            title="Reset"
            onPress={doReset}
            icon={
              <Icon
                name="refresh-outline"
                size={30}
                color="#FEFEF2"
                fontWeight="bold"
              />
            }
            iconLeft
            titleStyle={{
              paddingLeft: 16,
              color: '#FEFEF2',
            }}
            buttonStyle={{
              backgroundColor: '#0E2A25',
              borderRadius: 4,
              marginTop: 16,
              marginBottom: 16,
            }}
            accessible={true}
            accessibilityLabel="Reset"
            accessibilityHint="Resets the title and description to it original form"
            accessibilityRole="button"
          />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  audio: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  description: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FEFEF2',
    borderColor: '#FEFEF2',
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
