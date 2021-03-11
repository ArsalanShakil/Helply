import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/variables';
import {Audio, Video} from 'expo-av';
import Icon from 'react-native-vector-icons/Ionicons';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {upload} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    // add image to formData
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });
    console.log(type);
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('upload response', resp);
      const tagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll and camera permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;
    const options = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };
    if (library === 'library') {
      const source = {...options, mediaTypes: ImagePicker.MediaTypeOptions.All};
      result = await ImagePicker.launchImageLibraryAsync(source);
    } else if (library === 'photo') {
      const source = {
        ...options,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      };
      result = await ImagePicker.launchCameraAsync(source);
    } else {
      const source = {
        ...options,
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      };
      result = await ImagePicker.launchCameraAsync(source);
    }

    console.log(result);

    if (!result.cancelled) {
      // console.log('pickImage result', result);
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };

  const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    let result = null;
    console.log('Stopping recording..');
    setRecording(undefined);
    result = await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setFiletype('audio');
    setImage(uri);
    // console.log('Recording stopped and stored at', uri);
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{backgroundColor: '#FEFEF2'}}
    >
      <KeyboardAvoidingView behavior="position" enabled>
        <Card containerStyle={styles.card}>
          <Text h4 style={{color: '#0E2A25'}}>
            Upload media file
          </Text>
          {image && (
            <>
              {filetype === 'image' ? (
                <Image
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                  containerStyle={{borderRadius: 10, margin: 16}}
                />
              ) : (
                <Video
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                  useNativeControls={true}
                />
              )}
            </>
          )}
          <Input
            placeholder="add title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
            inputContainerStyle={{borderBottomWidth: 0, padding: 16}}
            accessible={true}
            accessibilityLabel="Input title"
            accessibilityHint="lets you input a title for your post"
          />
          <Input
            placeholder="add description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
            inputContainerStyle={{borderBottomWidth: 0, paddingLeft: 16}}
            accessible={true}
            accessibilityLabel="Input description"
            accessibilityHint="lets you input a description for your post"
          />
          <Card.Divider />
          <Button
            title="Open library"
            icon={
              <Icon
                name="image-outline"
                size={30}
                color="#0E2A25"
                fontWeight="bold"
              />
            }
            iconLeft
            type="clear"
            onPress={() => pickImage('library')}
            titleStyle={styles.buttonTitle}
            containerStyle={{marginRight: 150}}
            accessible={true}
            accessibilityLabel="Open library"
            accessibilityHint="Open the library to choose media"
            accessibilityRole="button"
          />
          <Button
            title="Take photo"
            icon={
              <Icon
                name="camera-outline"
                size={30}
                color="#0E2A25"
                fontWeight="bold"
              />
            }
            iconLeft
            type="clear"
            onPress={() => pickImage('photo')}
            titleStyle={styles.buttonTitle}
            containerStyle={{marginRight: 157}}
            accessible={true}
            accessibilityLabel="Take photo"
            accessibilityHint="Opens the camera to take a picture"
            accessibilityRole="button"
          />
          <Button
            title="Take video"
            icon={
              <Icon
                name="videocam-outline"
                size={30}
                color="#0E2A25"
                fontWeight="bold"
              />
            }
            iconLeft
            type="clear"
            onPress={() => pickImage('video')}
            titleStyle={styles.buttonTitle}
            containerStyle={{marginRight: 155}}
            accessible={true}
            accessibilityLabel="Take vidoe"
            accessibilityHint="Opens the camera to take a video"
            accessibilityRole="button"
          />
          <Button
            title={recording ? 'Stop Recording' : 'Start Recording'}
            onPress={recording ? stopRecording : startRecording}
            icon={
              <Icon
                name="mic-outline"
                size={30}
                color="#0E2A25"
                fontWeight="bold"
              />
            }
            iconLeft
            type="clear"
            titleStyle={styles.buttonTitle}
            containerStyle={{marginRight: 125}}
            accessible={true}
            accessibilityLabel="Record audio"
            accessibilityHint="Opens the mic to record audio"
            accessibilityRole="button"
          />
          {isUploading && <ActivityIndicator size="large" color="#0E2A25" />}

          <Button
            title="Upload file"
            onPress={doUpload}
            disabled={
              uploadErrors.title !== null ||
              uploadErrors.description !== null ||
              image === null
            }
            icon={
              <Icon
                name="cloud-upload-outline"
                size={30}
                color="#FEFEF2"
                fontWeight="bold"
              />
            }
            iconLeft
            titleStyle={{
              color: '#FEFEF2',
              paddingLeft: 16,
            }}
            buttonStyle={{marginRight: '53%', backgroundColor: '#0E2A25'}}
            accessible={true}
            accessibilityLabel="Upload media"
            accessibilityHint="Uploads the content of the post"
            accessibilityRole="button"
          />
          <Button
            title="Reset"
            icon={
              <Icon
                name="refresh-outline"
                size={30}
                color="#0E2A25"
                fontWeight="bold"
              />
            }
            iconLeft
            type="clear"
            onPress={doReset}
            titleStyle={styles.buttonTitle}
            containerStyle={{marginRight: '65%'}}
            accessible={true}
            accessibilityLabel="Reset"
            accessibilityHint="Resets the content of the post to nothing"
            accessibilityRole="button"
          />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEFEF2',
    borderRadius: 10,
  },
  buttonTitle: {
    color: '#0E2A25',
    paddingLeft: 16,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
