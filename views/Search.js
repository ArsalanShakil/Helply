import React from 'react';
import {SafeAreaView, StatusBar, TextInput, View} from 'react-native';
import Searchlist from '../components/Searchlist';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {useState, useContext, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const Search = ({navigation}) => {
  const {update, setUpdate} = useContext(MainContext);
  const [value, onChangeText] = useState('');

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#D0DCD0',
          paddingBottom: 16,
        }}
      >
        <TextInput
          style={{
            height: 60,
            borderColor: '#D0DCD0',
            borderWidth: 1,
            backgroundColor: '#FEFEF2',
            paddingLeft: 26,
            width: 350,
            left: 15,
            borderRadius: 50,
            flex: 1,
            fontSize: 25,
          }}
          placeholder="search"
          onChangeText={(text) => onChangeText(text)}
          value={value}
          accessible={true}
          accessibilityLabel="Search"
          accessibilityHint="Lets you input text to search up your posts"
          accessibilityRole="search"
        />
        <Icon
          name="search"
          color="#0E2A25"
          size={50}
          style={{right: 45, marginTop: 5}}
        />
      </View>

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
