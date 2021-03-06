import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
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
import {useRoute} from '@react-navigation/native';

const iconSize = 50;
const Upload = ({navigation}) => {
  const route = useRoute();

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

              if (route.name !== 'Home') {
                navigation.navigate('Home');
              }
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

    if (!result.cancelled) {
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
    Alert.alert('Audio recorded successfully');
    setImage(uri);
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{backgroundColor: '#FEFEF2'}}
    >
      <KeyboardAvoidingView behavior="position" enabled>
        <Card containerStyle={styles.card}>
          <Text
            style={{
              color: '#0E2A25',
              textAlign: 'center',
              margin: 15,
              fontSize: 25,
            }}
          >
            Tell us about your day
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              icon={
                <Icon
                  name="image-outline"
                  size={iconSize}
                  color="#0E2A25"
                  fontWeight="bold"
                />
              }
              iconLeft
              type="clear"
              onPress={() => pickImage('library')}
              accessible={true}
              accessibilityLabel="Open library"
              accessibilityHint="Open the library to choose media"
              accessibilityRole="button"
            />
            <Button
              icon={
                <Icon
                  name="camera-outline"
                  size={iconSize}
                  color="#0E2A25"
                  fontWeight="bold"
                />
              }
              iconLeft
              type="clear"
              onPress={() => pickImage('photo')}
              accessible={true}
              accessibilityLabel="Take photo"
              accessibilityHint="Opens the camera to take a picture"
              accessibilityRole="button"
            />
            <Button
              icon={
                <Icon
                  name="videocam-outline"
                  size={iconSize}
                  color="#0E2A25"
                  fontWeight="bold"
                />
              }
              iconLeft
              type="clear"
              onPress={() => pickImage('video')}
              accessible={true}
              accessibilityLabel="Take vidoe"
              accessibilityHint="Opens the camera to take a video"
              accessibilityRole="button"
            />
            <Button
              onPress={recording ? stopRecording : startRecording}
              icon={
                recording ? (
                  <Icon
                    name="mic-off"
                    size={iconSize}
                    color="#0E2A25"
                    fontWeight="bold"
                  />
                ) : (
                  <Icon
                    name="mic"
                    size={iconSize}
                    color="#0E2A25"
                    fontWeight="bold"
                  />
                )
              }
              iconLeft
              type="clear"
              accessible={true}
              accessibilityLabel="Record audio"
              accessibilityHint="Opens the mic to record audio"
              accessibilityRole="button"
            />
            {isUploading && <ActivityIndicator size="large" color="#0E2A25" />}
          </View>
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
            placeholder="Add some text..."
            style={{fontSize: 25}}
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
            inputContainerStyle={{borderBottomWidth: 0, padding: 16}}
            accessible={true}
            accessibilityLabel="Input title"
            accessibilityHint="lets you input a title for your post"
          />

          <Card.Divider />

          <Button
            title="Send"
            onPress={doUpload}
            disabled={uploadErrors.title !== null || image === null}
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
              fontSize: 25,
            }}
            buttonStyle={{backgroundColor: '#0E2A25'}}
            accessible={true}
            accessibilityLabel="Upload media"
            accessibilityHint="Uploads the content of the post"
            accessibilityRole="button"
          />
          {/*<Button
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
          />*/}
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
