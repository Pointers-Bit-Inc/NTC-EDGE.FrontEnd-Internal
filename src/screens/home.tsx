import React, {useState} from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { RootStateOrAny, useSelector } from 'react-redux';
import NTC101 from "@organisms/forms/ntc-1-01";
import Button from "@atoms/button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
      backgroundColor: 'white'
  }
});

const Home = () => {
  const user = useSelector((state: RootStateOrAny) => state.user);
  const [onNext , setOnNext] = useState(false)
  return (
    <SafeAreaView style={styles.container}>
      {!onNext && <NTC101 onSubmit={(value) =>  {
        //setOnNext(!onNext)
      }} />}
      {onNext &&
      <Button onPress={() => setOnNext(false) }>
        <Text>
          {'Previous'}
        </Text>
      </Button>
      }
    </SafeAreaView>
  );
};

export default Home;
