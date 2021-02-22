import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {Input, Button} from 'react-native-elements';
import Searchlist from '../components/Searchlist';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

// const {handleInputChange, inputs, uploadErrors, reset} = useSearchForm();

const Search = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <Input
        placeholder="search"
        // value={inputs.title}
        // onChangeText={(txt) => handleInputChange('title', txt)}
        // errorMessage={uploadErrors.title}
      />
      <Button title="Search" />
      <Searchlist
        navigation={navigation}
        // searchKeyword={'Test'}
        searchFilesOnly={true}
        // myFilesOnly={true}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
  searchFilesOnly: PropTypes.bool,
};

export default Search;
