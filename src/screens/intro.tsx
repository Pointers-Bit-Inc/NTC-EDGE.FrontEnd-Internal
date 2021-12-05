import React from 'react';
import { StyleSheet, Image, ImageBackground, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Text from '@components/atoms/text';
import Button from '@components/atoms/button';
import { text, button } from 'src/styles/color';
const background = require('assets/background.png');

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: '45%',
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
    bottom: 60,
    paddingHorizontal: 20,
    width: '100%',
  },
  getStarted: {
    backgroundColor: button.primary,
    borderRadius: 5,
  }
});

const slides = [
  {
    key: 1,
    title: 'Lorem ipsum',
    text: 'Lorem ipsum dolor sit amet, consectetur\nadipiscing elit, sed do eiusmod tempor\nincididunt ut labore et dolore magna\naliqua.',
    image: require('assets/logo.png'),
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
    <ImageBackground style={styles.slide} source={background}>
      <Image
        style={styles.image}
        source={slides[0].image}
      />
      <Text
        style={styles.title}
        color={text.primary}
        size={22}
        weight={'bold'}
      >
        {slides[0].title}
      </Text>
      <Text
        style={styles.text}
        color={text.default}
        size={16}
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
    </ImageBackground>
  )
}

export default AppIntro;
