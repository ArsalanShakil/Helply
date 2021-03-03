import React from 'react';
import {SafeAreaView, StatusBar, TextInput} from 'react-native';
import {Button} from 'react-native-elements';
import Searchlist from '../components/Searchlist';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {useState, useContext, useEffect} from 'react';

const Search = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [value, onChangeText] = useState('');

  const doUpdate = async () => {
    try {
      setUpdate(update + 1);
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <TextInput
        style={{height: 80, borderColor: 'gray', borderWidth: 1}}
        placeholder="search"
        onChangeText={(text) => onChangeText(text)}
        value={value}
      />
      <Button title="Search" onPress={doUpdate} />
      <Searchlist
        navigation={navigation}
        searchKeyword={value.toLowerCase()}
        searchFilesOnly={true}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
  searchFilesOnly: PropTypes.bool,
  searchKeyword: PropTypes.string,
};

export default Search;
