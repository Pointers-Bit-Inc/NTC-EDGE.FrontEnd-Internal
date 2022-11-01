import React,{FC} from 'react';
import {FlatList,Platform,TouchableOpacity,useWindowDimensions,View} from 'react-native';
import Text from '@atoms/text';
import {DropdownField} from '@molecules/form-fields';
import styles from './styles';
import moment from 'moment';
import Ellipsis from '@components/atoms/ellipsis';
import {infoColor} from '@styles/color';
import QuestionMarkIcon from "@assets/svg/questionMarkIcon";
import {RNValue as RFValue} from "../../../../utils/formatting";
import Calendar from "@atoms/icon/calendar";
import Clock from "@atoms/icon/clock";
import MapMarker from "@atoms/icon/map-marker";

interface Region {
  label?: string;
  value?: string;
};

interface Schedule {
  date?: string;
  venue?: string;
}

interface Props {
  serviceCode?: string;
  regions?: Region[];
  region?: Region;
  onPreSelect?: any;
  onChangeRegion?: any;
  schedule?: Schedule;
  schedules?: Schedule[];
  fetchingSchedules?: boolean;
  fetchingRegions?: boolean;
  onChangeSchedule?: any;
};

function RowContent(){
  return <>
    <View style={{justifyContent:"center",alignItems:"center",padding:RFValue(3 *1.2)}}>
      <QuestionMarkIcon height={RFValue(29 *1.2)} width={RFValue(29 *1.2)}></QuestionMarkIcon>
    </View>

    <View style={{justifyContent:"center",padding:RFValue(3 *1.2)}}>
      <View style={{paddingBottom:RFValue(7*1.2)}}>
        <View style={{borderRadius:RFValue(10*1.2),backgroundColor:"#B4DAFF",width:RFValue(32*1.2),height:RFValue(6*1.2),}}></View>
      </View>

      <View style={{borderRadius:RFValue(10*1.2),backgroundColor:"#DEE9FC",width:RFValue(50*1.2),height:RFValue(6*1.2)}}></View>
    </View>
  </>;
}

const Region: FC<Props> = ({
  serviceCode = '',
  regions = [],
  region = {},
  onPreSelect = () => {},
  onChangeRegion = () => {},
  schedule = {},
  schedules = [],
  fetchingSchedules,
  fetchingRegions,
  onChangeSchedule = () => {},
}) => {
  const {width, height} = useWindowDimensions();
  const hasSchedule = serviceCode === 'service-1';
  const renderSchedules = ({item, index}: any) => {
    return (
      <TouchableOpacity onPress={() => onChangeSchedule(item)}>
        <View style={[
          styles?.scheduleContainer,
          //Platform.OS === 'web' && {width : ((width>=768 ? width * 0.60978835978 : width * 0.90)  -  (120 + 72 + 72)) /3 ,} ,
          schedule?.id === item?.id && styles?.selectedScheduleContainer,
        ]}>
          <View style={styles?.scheduleRow}>
            <Calendar size={20} style={styles?.scheduleIcon} />
            <Text style={styles?.scheduleText}>{moment(item?.dateStart).format('ddd DD MMMM YYYY')}</Text>
          </View>
          <View style={styles?.scheduleInnerSeparator} />
          <View style={styles?.scheduleRow}>
            <Clock size={20} style={styles?.scheduleIcon} />
            <Text style={styles?.scheduleText}>{moment(item?.dateStart).format('h:mm A')} - {moment(item?.dateEnd).format('h:mm A')}</Text>
          </View>
          <View style={styles?.scheduleInnerSeparator} />
          <View style={styles?.scheduleRow}>
            <MapMarker size={20} style={styles?.scheduleIcon} />
            <Text style={styles?.scheduleText}>{item?.venue}</Text>
          </View>
          {/* <View style={styles?.scheduleInnerSeparator} />
          <View style={styles?.scheduleRow}>
            <Clock size={20} style={styles?.scheduleIcon} />
            <Text style={styles?.scheduleText}>{moment(item?.dateEnd).format('LT')}</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles?.mainContainer}>
      <View style={[styles?.subContainer, styles?.dropdownContainer, !hasSchedule && styles?.subContainerFull]}>
        <Text style={styles?.labelText}>Select from which region you intend to apply:</Text>
        <DropdownField
          items={regions}
          placeholder='Region'
          value={region?.label || region?.value}
          onPreSelect={onPreSelect}
          onChangeValue={onChangeRegion}
          loading={fetchingRegions}
        />
      </View>
      {
        hasSchedule &&
        region?.value &&
        <View style={[styles?.subContainer, styles?.schedulesContainer]}>
          <Text style={{marginBottom: 15}}>Scheduled Dates</Text>
          {
            fetchingSchedules
            ? <View style={styles?.ellipsisContainer}>
                <Ellipsis color={infoColor} size={10} />
              </View>
            : <View style={Platform.OS === 'web' && styles.borderContainer}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={styles?.flatlist}
                  data={schedules}
                  renderItem={renderSchedules}
                  keyExtractor={(item, index) => `${index}`}
                  numColumns={Platform.select({
                    native: 1,
                    web: 1
                  })}
                  ListEmptyComponent={() => {
                    return (
                      <View style={styles?.emptyListContainer}><View style={{backgroundColor:"#DAE7FF",width:RFValue(140*1.2),height:RFValue(140*1.2),borderRadius:10}}>

                        <View style={[styles.row,{marginLeft:RFValue(-21*1.2),marginTop:RFValue(10*1.2),}]}>
                          <RowContent/>
                        </View>
                        <View style={[styles.row,{marginLeft:RFValue(21*1.2),marginTop:RFValue(53*1.2),}]}>
                          <RowContent/>
                        </View>
                        <View style={[styles.row,{marginLeft:RFValue(-21*1.2),marginTop:RFValue(96*1.2),}]}>
                          <RowContent/>
                        </View>
                      </View>

                      <View style={{paddingTop: 20}}>
                        <Text style={styles?.emptyListText}>No schedules yet</Text>
                      </View>

                    </View>
                    )
                  }}
                  ListFooterComponent={() => <View style={styles?.footerView} />}
                  ItemSeparatorComponent={() => <View style={styles?.separatorView} />}

                />
              </View>
          }
        </View>
      }
    </View>
  )
};

export default Region;
