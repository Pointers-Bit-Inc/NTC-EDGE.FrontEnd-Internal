import React from 'react';
import { StyleSheet, Image, ImageBackground, View, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Text from '@components/atoms/text';
import Button from '@components/atoms/button';
import { text, button } from 'src/styles/color';
const background = require('assets/background.png');
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  image: {
    width: width * 0.75,
    height: width * 0.75,
    marginTop: height * 0.18,
    marginBottom: 15,
  },
  textButton: {
    fontWeight: "500"  ,
  },
  title: {

    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 35,
    paddingHorizontal: 20,
    width: '100%',
  },
  getStarted: {
    backgroundColor: button.primary,
    borderRadius: 5,
    paddingVertical: 12,
  }
});

const slides = [
  {
    key: 1,
    title: 'Welcome to',
    text: 'NTC-EDGE app',
    image: require('assets/WELCOME.png'),
  },
  {
    key: 2,
    title: 'Lorem ipsum',
    text: 'Lorem ipsum dolor sit amet, consectetur\nadipiscing elit, sed do eiusmod tempor\nincididunt ut labore et dolore magna\naliqua.',
    image: require('assets/logo.png'),
  },
  {
    key: 3,
    title: 'Lorem ipsum',
    text: 'Lorem ipsum dolor sit amet, consectetur\nadipiscing elit, sed do eiusmod tempor\nincididunt ut labore et dolore magna\naliqua.',
    image: require('assets/logo.png'),
  }
];
 

const AppIntro = ({ navigation }:any) => {
  const onRenderItem = ({ item }:any) => {
    return (
      <ImageBackground style={styles.slide} source={background}>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.title} color={text.primary} size={22} weight={'bold'}>{item.title}</Text>
        <Text style={styles.text} color={text.default} size={16}>{item.text}</Text>
      </ImageBackground>
    );
  };
  const onDone = () => {
    navigation.replace('Login');
  };
  const onRenderDoneButton = () => {
    return (
      <View style={styles.button}>
        <Text size={22} color={text.default}>Done</Text>
      </View>
    )
  }
  const onRenderNextButton = () => {
    return (
      <View style={styles.button}>
        <Text size={22} color={text.default}>Next</Text>
      </View>
    )
  }

  // return (
  //   <AppIntroSlider
  //     renderItem={onRenderItem}
  //     data={slides}
  //     onDone={onDone}
  //     renderDoneButton={onRenderDoneButton}
  //     renderNextButton={onRenderNextButton}
  //   />
  // )
  return (
    <View style={styles.slide}>
      <Image
        style={styles.image}
        source={slides[0].image}
        resizeMode='contain'
      />
      <Text
        style={styles.title}
        color={text.primary}
        size={26}
        weight={'bold'}
      >
        {slides[0].title}
      </Text>
      <Text
        style={styles.title}
        color={text.primary}
        size={26}
        weight={'bold'}
      >
        {slides[0].text}
      </Text>
      <View style={styles.footer}>
        <Button
          style={styles.getStarted}
          onPress={onDone}
        >
          <Text
            color={'white'}
            size={18}
          >
            Get Started
          </Text>
        </Button>
      </View>
    </View>
  )
}

export default AppIntro;
