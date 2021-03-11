import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/SearchHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert, Image, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchListItem = ({navigation, singleMedia, isSearchFile}) => {
  // console.log(props);
  const {deleteFile} = useMedia();
  const {setUpdate, update} = useContext(MainContext);

  const doDelete = () => {
    Alert.alert(
      'Delete',
      'this file permanently?',
      [
        {text: 'Cancel'},
        {
          text: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteFile(singleMedia.file_id, userToken);
              setUpdate(update + 1);
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      {cancelable: false}
    );
  };

  return (
    <>
      {isSearchFile && (
        <RNEListItem
          bottomDivider
          onPress={() => {
            navigation.navigate('Single', {file: singleMedia});
          }}
          containerStyle={{
            backgroundColor: '#FEFEF2',
            flexDirection: 'column',
            marginTop: 2,
          }}
          accessible={true}
          accessibilityLabel="Open post"
          accessibilityHint="Opens up the post and shows more details"
          accessibilityRole="button"
        >
          <Image
            source={
              singleMedia.thumbnails
                ? {
                    uri: uploadsUrl + singleMedia.thumbnails.w640,
                  }
                : require('../assets/play.jpg')
            }
            style={{width: 360, height: 300}}
            accessible={true}
            accessibilityLabel="Media"
            accessibilityHint="Preview of the media of the post"
            accessibilityRole="image"
          ></Image>
          <RNEListItem.Content>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  marginTop: -62,
                  width: 360,
                }}
              >
                <Button
                  title=""
                  icon={
                    <Icon
                      name="create-outline"
                      size={50}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                  onPress={() => navigation.push('Modify', {file: singleMedia})}
                  accessible={true}
                  accessibilityLabel="Modify post"
                  accessibilityHint="Lets you modify the content of the  post"
                  accessibilityRole="button"
                ></Button>
                <Button
                  title=""
                  icon={
                    <Icon
                      name="trash-outline"
                      size={50}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                  color="red"
                  onPress={doDelete}
                  accessible={true}
                  accessibilityLabel="Delete post"
                  accessibilityHint="Deletes the post"
                  accessibilityRole="button"
                ></Button>
              </View>
            </>
            <RNEListItem.Title
              text
              style={{fontSize: 25, fontWeight: '400', paddingBottom: 16}}
              accessible={true}
              accessibilityLabel="Post title"
              accessibilityHint="Title of the post"
            >
              {singleMedia.title}
            </RNEListItem.Title>
          </RNEListItem.Content>
          <RNEListItem.Chevron />
        </RNEListItem>
      )}
    </>
  );
};

SearchListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isSearchFile: PropTypes.bool,
};

export default SearchListItem;
