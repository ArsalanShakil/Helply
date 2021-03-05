import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, ActivityIndicator, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser, useComment} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import {MainContext} from '../contexts/MainContext';
import {Keyboard} from 'react-native';

const Single = ({route}) => {
  const {file} = route.params;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const [comment, setComment] = useState([]);
  const {getFilesByTag} = useTag();
  const {getUser} = useUser();
  const {getComment} = useComment();
  const {postComment} = useComment();
  const [videoRef, setVideoRef] = useState(null);
  const [value, onChangeText] = useState('');

  // comments

  const fetchComments = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const fileComment = await getComment(file.file_id, userToken);
      setComment(fileComment);
    } catch (error) {
      console.error(error.message);
    }
  };

  const sendComment = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      body: JSON.stringify(
        {
          file_id: file.file_id,
          comment: value,
        },
        userToken
      ),
    };
    postComment(options);
    fetchComments();
    onChangeText('');
    Keyboard.dismiss();
  };

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(file.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();
    fetchComments();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      // console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={{backgroundColor: '#f5e4d5'}}
    >
      <Card containerStyle={styles.card}>
        <Card.Title h4>{file.title}</Card.Title>
        <Card.Title>{moment(file.time_added).format('LLL')}</Card.Title>
        <Card.Divider />
        {(() => {
          if (file.media_type === 'image') {
            return (
              <Card.Image
                source={{uri: uploadsUrl + file.filename}}
                style={styles.image}
                PlaceholderContent={<ActivityIndicator />}
              />
            );
          } else if (file.media_type === 'video') {
            return (
              <Video
                ref={handleVideoRef}
                source={{uri: uploadsUrl + file.filename}}
                style={styles.image}
                useNativeControls={true}
                resizeMode="cover"
                onError={(err) => {
                  console.error('video', err);
                }}
                posterSource={{uri: uploadsUrl + file.screenshot}}
              />
            );
          } else if (file.media_type === 'audio') {
            return (
              <Video
                source={{uri: uploadsUrl + file.filename}}
                style={styles.audio}
                useNativeControls={true}
                onError={(err) => {
                  console.error('audio', err);
                }}
                posterSource={{uri: 'https://placekitten.com/230'}}
              />
            );
          }
        })()}
        <Card.Divider />
        <ListItem containerStyle={{backgroundColor: '#FEFEF2'}}>
          <Avatar source={{uri: avatar}} rounded />
          <Text style={{fontWeight: 'bold'}}>{owner.username}</Text>
          <Text style={{width: 170}}>{file.description}</Text>
        </ListItem>
        {comment.length > 0 ? (
          <>
            {comment.map((item) => (
              <Text key={item.comment_id}>{item.comment}</Text>
            ))}
          </>
        ) : (
          <>
            <Text>Noone has commented yet...</Text>
          </>
        )}
        <TextInput
          style={{height: 80, borderColor: 'gray', borderWidth: 1}}
          placeholder="comment"
          onChangeText={(text) => onChangeText(text)}
          value={value}
        />
        <Button title="submit comment" onPress={sendComment} />
      </Card>
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

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
