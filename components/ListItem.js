import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

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

  // console.log(singleMedia);
  return (
    <RNEListItem
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
      containerStyle={{
        backgroundColor: '#FEFEF2',
        flexDirection: 'column',
        marginTop: 32,
      }}
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
      <RNEListItem.Content style={{alignItems: 'center'}}>
        {isMyFile && (
          <>
            <View style={{flexDirection: 'row', left: 110, paddingBottom: 24}}>
              <Button
                title=""
                icon={
                  <Icon
                    name="create-outline"
                    size={34}
                    color="#0E2A25"
                    fontWeight="bold"
                  />
                }
                iconRight
                type="clear"
                onPress={() => navigation.push('Modify', {file: singleMedia})}
                accessibilityLabel="Modify post"
                accessibilityHint="Lets you modify the content of the  post"
                accessibilityRole="button"
              ></Button>
              <Button
                title=""
                icon={
                  <Icon
                    name="trash-outline"
                    size={34}
                    color="#0E2A25"
                    fontWeight="bold"
                  />
                }
                iconRight
                type="clear"
                onPress={doDelete}
                accessible={true}
                accessibilityLabel="Delete post"
                accessibilityHint="Deletes the post"
                accessibilityRole="button"
              ></Button>
            </View>
          </>
        )}
      </RNEListItem.Content>
      <Icon name="chevron-down-outline" size={20} color="#7a7a7a" />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
  route: PropTypes.object,
};

export default ListItem;
