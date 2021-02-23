import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/SearchHooks';
import SearchListItem from './SearchListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const Searchlist = ({navigation, searchFilesOnly, searchKeyword}) => {
  const {user} = useContext(MainContext);
  const mediaArray = useLoadMedia(searchFilesOnly, searchKeyword, user.user_id);

  return (
    <FlatList
      data={mediaArray.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <SearchListItem
          navigation={navigation}
          singleMedia={item}
          isSearchFile={
            item.user_id === user.user_id &&
            (item.title.toLowerCase().includes(searchKeyword) ||
              item.description.toLowerCase().includes(searchKeyword))
          }
        />
      )}
    />
  );
};

Searchlist.propTypes = {
  navigation: PropTypes.object,
  searchFilesOnly: PropTypes.bool,
  searchKeyword: PropTypes.string,
};

export default Searchlist;
