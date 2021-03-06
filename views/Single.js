import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, ActivityIndicator, TextInput, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Card,
  ListItem,
  Text,
  Rating,
  AirbnbRating,
} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser, useComment, useRating} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import {MainContext} from '../contexts/MainContext';
import {Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

const Single = ({route}) => {
  const {file} = route.params;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const [comment, setComment] = useState([]);
  const [rating, setRating] = useState([]);
  const [cannotRate, setCannotRate] = useState([]);
  const {getFilesByTag} = useTag();
  const {getUser} = useUser();
  const {getComment} = useComment();
  const {postComment} = useComment();
  const {deleteComm} = useComment();
  const {getRating} = useRating();
  const {postRating} = useRating();
  const [videoRef, setVideoRef] = useState(null);
  const [value, onChangeText] = useState('');

  // rating

  const fetchRating = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const fileRating = await getRating(file.file_id, userToken);
      if (fileRating.length > 0) {
        setRating(fileRating[0].rating);
        setCannotRate(true);
      } else {
        setRating(0);
        setCannotRate(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchRating();
  const ratingCompleted = async (rating) => {
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
          rating: rating,
        },
        userToken
      ),
    };
    postRating(options);
    setCannotRate(true);
  };

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

  const deleteComment = (key) => {
    Alert.alert(
      'Delete',
      'this comment permanently?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              console.log(key);
              await deleteComm(key, userToken);
              fetchComments();
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      {cancelable: true}
    );
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
        <View style={styles.rating}>
          <Text style={{fontSize: 16}}>How do you feel today?</Text>
          <AirbnbRating
            showRating
            type="star"
            ratingCount={5}
            imageSize={30}
            showRating={true}
            selectedColor="#0E2A25"
            unSelectedColor="#BDC3C7"
            ratingBackgroundColor="#0E2A25"
            reviewColor="#0E2A25"
            reviewSize={20}
            defaultRating={rating}
            isDisabled={cannotRate}
            onFinishRating={ratingCompleted}
          />
        </View>
        <ListItem containerStyle={{backgroundColor: '#FEFEF2'}}>
          <Avatar source={{uri: avatar}} rounded />
          <Text style={{fontWeight: 'bold', fontSize: 20}}>
            {owner.username}
          </Text>
          <Text style={{width: 150, fontSize: 18}}>{file.description}</Text>
        </ListItem>
        {comment.length > 0 ? (
          <>
            {comment.map((item) => (
              <Card key={item.comment_id} containerStyle={styles.comment}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  {item.owner.username}
                </Text>
                <Text style={{fontSize: 20}}>{item.comment}</Text>
                <Text style={{marginTop: 16}}>
                  {moment(item.time_added).format('LLL')}
                </Text>
                <Button
                  title=""
                  icon={
                    <Icon
                      name="trash-outline"
                      size={26}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                  onPress={() => {
                    deleteComment(item.comment_id);
                  }}
                  buttonStyle={{width: 50, marginLeft: '80%'}}
                ></Button>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Text style={{padding: 16, fontSize: 16}}>
              No one has commented yet...
            </Text>
          </>
        )}
        <TextInput
          style={{
            height: 50,
            borderColor: '#D0DCD0',
            borderWidth: 1,
            backgroundColor: '#f3fff2',
            paddingLeft: 20,
            borderRadius: 50,
          }}
          placeholder="comment..."
          onChangeText={(text) => onChangeText(text)}
          value={value}
        />
        <Button
          title="send comment"
          onPress={sendComment}
          icon={<Icon name="send" size={26} color="#FEFEF2" />}
          iconRight
          titleStyle={{
            paddingRight: 24,
            color: '#FEFEF2',
          }}
          buttonStyle={{
            backgroundColor: '#0E2A25',
            borderRadius: 10,
            marginTop: 16,
            height: 50,
            width: 200,
            marginLeft: '16%',
          }}
        />
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
  rating: {
    backgroundColor: '#f3fff2',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 6,
  },
  comment: {
    marginBottom: 16,
    marginTop: 0,
    borderRadius: 10,
    backgroundColor: '#f3fff2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 3,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};
export default Single;
