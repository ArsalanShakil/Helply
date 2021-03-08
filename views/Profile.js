import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, ListItem, Avatar} from 'react-native-elements';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {ScrollView} from 'react-native-gesture-handler';
import {View} from 'react-native';
import {ImageBackground} from 'react-native';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('userToken');
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAvatar();
  }, []);

  return (
    <ScrollView
      style={{backgroundColor: '#f5e4d5'}}
      accessible={true}
      accessibilityLabel="Profile Screen"
      accessibilityHint="Shows all the details about your profile"
    >
      <Card containerStyle={styles.card}>
        <ImageBackground
          source={require('../assets/bg.jpg')}
          style={{
            width: 320,
            height: 200,
            marginLeft: -10,
            marginTop: -10,
            marginBottom: 48,
          }}
          imageStyle={{
            borderRadius: 10,
          }}
        >
          <Card.Image
            source={{uri: avatar}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        </ImageBackground>
        <Card.Title>
          <Text
            style={{fontSize: 26, color: '#0E2A25'}}
            accessible={true}
            accessibilityLabel="Username"
            accessibilityHint="Your username"
          >
            {user.username}
          </Text>
        </Card.Title>
        <ListItem containerStyle={styles.content}>
          <Avatar
            icon={{name: 'mail', color: '#0E2A25', type: 'ionicon', size: 24}}
          />
          <Text
            style={styles.text}
            accessible={true}
            accessibilityLabel="Email"
            accessibilityHint="Your email"
          >
            {user.email}
          </Text>
        </ListItem>
        <ListItem containerStyle={styles.content}>
          <Avatar
            icon={{name: 'person', type: 'ionicon', color: '#0E2A25', size: 24}}
          />
          <Text
            style={styles.text}
            accessible={true}
            accessibilityLabel="Fullname"
            accessibilityHint="Your fullname"
          >
            {user.full_name}
          </Text>
        </ListItem>
        <ListItem
          containerStyle={styles.content}
          bottomDivider
          onPress={() => navigation.push('My Files')}
        >
          <Avatar
            icon={{name: 'images', color: '#0E2A25', type: 'ionicon', size: 24}}
          />
          <ListItem.Content>
            <ListItem.Title
              style={styles.text}
              accessible={true}
              accessibilityLabel="Your posts"
              accessibilityHint="Displays all your posts"
              accessibilityRole="button"
            >
              My Posts
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          containerStyle={styles.content}
          bottomDivider
          onPress={logout}
        >
          <Avatar
            icon={{
              name: 'log-out-outline',
              color: '#0E2A25',
              type: 'ionicon',
              size: 24,
            }}
          />
          <ListItem.Content>
            <ListItem.Title
              style={styles.text}
              accessible={true}
              accessibilityLabel="Logout"
              accessibilityHint="lets you logout of your id"
              accessibilityRole="button"
            >
              Logout
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '35%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 150,
    borderWidth: 5,
    borderColor: '#FEFEF2',
    marginTop: 130,
    marginLeft: 100,
  },
  card: {
    backgroundColor: '#FEFEF2',
    borderColor: '#FEFEF2',
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 0,
  },
  content: {
    backgroundColor: '#FEFEF2',
  },
  text: {
    color: '#0E2A25',
    fontSize: 16,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
