import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
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
          title: 'Ok',
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

  // console.log(singleMedia);
  return (
    <RNEListItem
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
      containerStyle={{backgroundColor: '#FEFEF2', flexDirection: 'column'}}
    >
      <Image
        source={
          singleMedia.thumbnails
            ? {
                uri: uploadsUrl + singleMedia.thumbnails.w160,
              }
            : require('../assets/play.jpg')
        }
        style={{width: 360, height: 300}}
      ></Image>
      <RNEListItem.Content style={{alignItems: 'center'}}>
        <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title>
        {/* <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title> */}
        <RNEListItem.Subtitle>{singleMedia.description}</RNEListItem.Subtitle>
        {isMyFile && (
          <>
            <Button
              title="Modify"
              onPress={() => navigation.push('Modify', {file: singleMedia})}
            ></Button>
            <Button title="Delete" color="red" onPress={doDelete}></Button>
          </>
        )}
      </RNEListItem.Content>
      <Icon name="chevron-down-outline" size={30} color="#0E2A25" />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
