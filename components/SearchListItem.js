import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/SearchHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

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

  console.log('isSearchFile: ', isSearchFile);
  return (
    <>
      {isSearchFile && (
        <RNEListItem
          bottomDivider
          containerStyle={{
            backgroundColor: '#FEFEF2',
          }}
          onPress={() => {
            navigation.navigate('Single', {file: singleMedia});
          }}
        >
          <Avatar
            size="xlarge"
            square
            source={
              singleMedia.thumbnails
                ? {
                    uri: uploadsUrl + singleMedia.thumbnails.w160,
                  }
                : require('../assets/play.jpg')
            }
          ></Avatar>
          <RNEListItem.Content>
            <RNEListItem.Title
              text
              style={{fontSize: 16, fontWeight: '400', paddingBottom: 16}}
            >
              {singleMedia.title}
            </RNEListItem.Title>
            <RNEListItem.Subtitle style={{fontSize: 16}}>
              {singleMedia.description}
            </RNEListItem.Subtitle>

            <>
              <View
                style={{
                  flexDirection: 'row',
                  left: 70,
                  paddingTop: 30,
                }}
              >
                <Button
                  title=""
                  icon={
                    <Icon
                      name="create-outline"
                      size={30}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                  onPress={() => navigation.push('Modify', {file: singleMedia})}
                ></Button>
                <Button
                  title=""
                  icon={
                    <Icon
                      name="trash-outline"
                      size={30}
                      color="#0E2A25"
                      fontWeight="bold"
                    />
                  }
                  iconRight
                  type="clear"
                  color="red"
                  onPress={doDelete}
                ></Button>
              </View>
            </>
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
