import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import Upload from '../views/Upload';

const List = ({navigation, myFilesOnly}) => {
  const {user} = useContext(MainContext);
  const mediaArray = useLoadMedia(myFilesOnly, user.user_id);

  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      ListHeaderComponent={<Upload />}
      data={mediaArray.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          isMyFile={item.user_id === user.user_id}
        />
      )}
    ></FlatList>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default List;
