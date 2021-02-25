import React from 'react';
import {Image, View} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import Login from '../views/Login';

const Next = ({...props}) => (
  <Button
    buttonStyle={{
      color: '#0E2A25',
      marginRight: 20,
      marginBottom: 2,
    }}
    titleStyle={{
      paddingRight: 10,
      color: '#0E2A25',
      fontSize: 20,
    }}
    icon={<Icon name="arrow-forward" size={25} color="#0E2A25" />}
    iconRight
    type="clear"
    title="Next"
    {...props}
  ></Button>
);
const Skip = ({...props}) => (
  <Button
    buttonStyle={{
      marginLeft: 20,
    }}
    titleStyle={{
      color: '#B7B7B7',
      fontSize: 20,
    }}
    type="clear"
    title="Skip"
    {...props}
  ></Button>
);
const Dots = ({selected}) => {
  let backgroundColor;
  backgroundColor = selected ? 'rgb(63,61,86)' : 'rgb(212, 204, 196)';
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor,
        marginHorizontal: 3,
        marginBottom: 1300,
      }}
    ></View>
  );
};
const Done = ({...props}) => (
  <Button
    buttonStyle={{
      color: '#0E2A25',
      marginRight: 20,
      marginBottom: 2,
    }}
    titleStyle={{
      paddingRight: 10,
      color: '#0E2A25',
      fontSize: 20,
    }}
    icon={<Icon name="checkmark-circle" size={25} color="#0E2A25" />}
    iconRight
    type="clear"
    title="Done"
    {...props}
  ></Button>
);

const OnboardingScreen = ({navigation}) => {
  return (
    <Onboarding
      onSkip={() => navigation.navigate('Login')}
      onDone={() => navigation.navigate('Login')}
      bottomBarHighlight={false}
      bottomBarHeight={90}
      NextButtonComponent={Next}
      SkipButtonComponent={Skip}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      titleStyles={{color: '#0E2A25', paddingBottom: 24, paddingTop: 24}}
      imageContainerStyles={{paddingBottom: 0}}
      subTitleStyles={{color: '#0E2A25'}}
      pages={[
        {
          backgroundColor: '#FEFEF2',
          image: (
            <Image
              source={require('../assets/onBoardingScreen-1.png')}
              style={{width: 290, height: 250, marginTop: -120}}
            />
          ),
          title: 'Welcome',
          subtitle: (
            <Image
              source={require('../assets/onBoardinScreen-text-1.png')}
              style={{width: 260, height: 50, marginLeft: 20, marginTop: 24}}
            />
          ),
        },
        {
          backgroundColor: '#f5e4d5',
          image: (
            <Image
              source={require('../assets/onBoardingScreen-2.png')}
              style={{width: 320, height: 200}}
            />
          ),
          title: 'Stay connected',
          subtitle: (
            <Image
              source={require('../assets/onBoardinScreen-text-2.png')}
              style={{width: 250, height: 120, marginLeft: 50, marginTop: 24}}
            />
          ),
        },
        {
          backgroundColor: '#f3fff2',
          image: (
            <LottieView
              source={require('../assets/animation.json')}
              autoPlay
              loop
              style={{
                width: 400,
                height: 400,
                marginBottom: -120,
                marginTop: -50,
              }}
            />
          ),
          title: 'Monitoring',
          subtitle: (
            <Image
              source={require('../assets/onBoardinScreen-text-3.png')}
              style={{width: 265, height: 150, marginLeft: 30, marginTop: 24}}
            />
          ),
        },
      ]}
    />
  );
};

export default OnboardingScreen;
/* <Image
              source={require('../assets/onBoardingScreen-3.png')}
              style={{width: 320, height: 200}}
            /> */
