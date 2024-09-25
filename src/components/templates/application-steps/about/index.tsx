import React, { FC } from 'react';
import {View,FlatList,Platform} from 'react-native';
import Text from '@atoms/text';
import styles from './styles';

interface Props {
  content?: any;
};

const renderSeparator = () => <View style={styles.separator} />;
const renderSeparator2 = () => <View style={styles.separator2} />;
const renderFooter = () => <View style={styles.footer} />;

const renderSubList = ({item}: any) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.subText, styles.indentedText]}>•</Text>
      <View style={styles.rightView}>
        <Text style={styles.subText}>{item}</Text>
      </View>
    </View>
  )
}

const renderList = ({item, index}: any) => {
  let { title, list } = item;
  let hasList = list?.length > 0;
  let textStyle = hasList ? styles.headerText : styles.subText;
  return (
    <>
      <View style={styles.row}>
        <Text style={textStyle}>{index + 1}.</Text>
        <View style={styles.rightView}>
          <Text style={textStyle}>{title}</Text>
        </View>
      </View>
      {
        hasList &&
        <FlatList
          style={styles.flatlist2}
          data={list}
          renderItem={renderSubList}
          keyExtractor={(item, index) => `${index}`}
          ItemSeparatorComponent={() => renderSeparator2()}
        />
      }
    </>
  )
};

const About: FC<Props> = ({
  content = {},
}) => {
  const {
    heading = '',
    description = '',
    whoMayAvail = [],
  } = content;
  return (
    <FlatList
      style={styles.flatlist}
      showsVerticalScrollIndicator={true}
      data={[0, 1]}
      renderItem={({item}) => {
        if (item === 0) {
          return (
            <View style={styles.mainHeaderContainer}>
              <Text style={[styles.headerText, styles.mainHeaderText]}>{heading}</Text>
              {
                !!description &&
                <Text style={styles.subText}>{description}</Text>
              }
            </View>
          )
        }
        else {
          return (
              <View style={{...Platform.select({web: {top: -20}})}}>
                  <FlatList
                      showsVerticalScrollIndicator={true}
                      style={styles.flatlistContainer}

                      data={whoMayAvail}
                      ListHeaderComponent={(
                          <>
                              <Text style={styles.whoMayAvailText}>WHO MAY AVAIL:</Text>
                          </>
                      )}
                      ListFooterComponent={() => renderFooter()}
                      renderItem={renderList}
                      ItemSeparatorComponent={() => renderSeparator()}
                      keyExtractor={(item, index) => `${index}`}
                  />
              </View>



          )
        }
      }}
      keyExtractor={(item, index) => `${index}`}
    />
  )
};

export default About;