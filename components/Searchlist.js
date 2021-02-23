import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/SearchHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const Searchlist = ({navigation, searchFilesOnly, searchKeyword}) => {
  const {user} = useContext(MainContext);
  const mediaArray = useLoadMedia(searchFilesOnly, searchKeyword);

  return (
    <FlatList
      data={mediaArray.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          isSearchFile={item.title === searchKeyword}
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
