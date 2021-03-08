import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List
        navigation={navigation}
        accessible={true}
        accessibilityLabel="Home Screen"
        accessibilityHint="Shows all the posts"
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
