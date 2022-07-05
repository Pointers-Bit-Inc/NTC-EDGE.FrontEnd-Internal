import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  FlatList,
  RefreshControl,
  Platform,useWindowDimensions,
} from 'react-native'
import lodash from 'lodash';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { setMeeting, setMeetings, addToMeetings, resetCurrentMeeting, setOptions } from 'src/reducers/meeting/actions';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import useSignalr from 'src/hooks/useSignalr';
import Meeting from '@components/molecules/list-item/meeting';
import Text from '@components/atoms/text'
import { getChannelName } from 'src/utils/formatting';
import {AddMeetingIcon, NewVideoIcon,PlusIcon,VideoIcon} from '@atoms/icon';
import { text, outline, primaryColor } from 'src/styles/color';
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import { ListFooter } from '@components/molecules/list-item';
import MeetingParticipants from '@components/pages/chat-modal/meeting-participants';
import HomeMenuIcon from "@assets/svg/homemenu";
import {Bold,Regular} from "@styles/font";
import CreateMeeting from '@components/pages/chat-modal/meeting';
import IMeetings from 'src/interfaces/IMeetings';
import IParticipants from 'src/interfaces/IParticipants';
import {isMobile} from "@pages/activities/isMobile";
import hairlineWidth=StyleSheet.hairlineWidth;
import {fontValue as RFValue} from "@pages/activities/fontValue";
import NoConversationIcon from "@assets/svg/noConversations";
import SdIcon from "@assets/svg/webitem/sd";
import ApIcon from "@assets/svg/webitem/ap";
import JsIcon from "@assets/svg/webitem/js";
import VideoOutlineIcon from "@assets/svg/videoOutline";
import CalendarAddOutline from "@assets/svg/calendarAddOutline";
import { BASE_URL } from 'src/services/config';
import { openUrl } from 'src/utils/web-actions';

const { width, height } = Dimensions.get('window');

const size = width * 0.45;
const sectionHeight = size * 0.25;
const position = sectionHeight - RFValue(8);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  meetingContainer:{
      zIndex:1,
      shadowColor:"rgba(0,0,0,0.1)",
      shadowOffset:{
        width:0,
        height:4
      },
      elevation:30,
      shadowOpacity:1,
      shadowRadius:10,
  },
  header: {
    borderBottomWidth:hairlineWidth,
    borderBottomColor:"#EFEFEF"
  },
  titleContainer: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 60,
  },
  image: {
    height: width * 0.5,
    width: width * 0.65,
    backgroundColor: '#DCE2E5',
    borderRadius: 10,
    marginVertical: 15,
  },
  text: {
    marginVertical: 5,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 15,
    borderColor: outline.default,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  bar: {
    height: 15,
    width: 35,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftPosition: {
    width: size,
    height: sectionHeight - 2,
    backgroundColor: 'white',
    borderRadius: 5,
    left: -position,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: RFValue(20)
  },
  rightPosition: {
    width: size,
    height: sectionHeight - 2,
    backgroundColor: 'white',
    borderRadius: 5,
    right: -position,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: RFValue(20)
  },
  circle: {
    height: RFValue(18),
    width: RFValue(18),
    backgroundColor: '#2863D6',
    borderRadius: RFValue(18),
  },
  emptyMeeting: {
    backgroundColor: '#DAE7FF',
    width: size,
    height: size,
    borderRadius: RFValue(10),
    paddingVertical: 10,
    justifyContent: 'space-around'
  },
  headerContent:{
    justifyContent:"center",
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:"#fff",
    paddingTop:15,
    paddingBottom: 20,
    paddingHorizontal:26
  } ,
  row: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    flexDirection: "row",
    paddingVertical: 11,
    paddingHorizontal: 30,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,width: 207.17, height: 50}
})

function Content(){
  return <View style={{paddingHorizontal:14.30,justifyContent:"space-between"}}>
    <View style={{borderRadius:20,backgroundColor:"#B4DAFF",width:45.71,height:8.57}}/>
    <View style={{borderRadius:20,backgroundColor:"#DEE9FC",width:71.43,height:8.57}}/>
  </View>;
}

export function NoContent(){
  return <View style={{width:200,height:200,backgroundColor:"#E3ECFA",borderRadius:20}}>
    <View style={[
      styles.row,
      {
        marginTop:15,
        marginLeft:-37.14,
      }
    ]}>
      <SdIcon/>
      <Content/>
    </View>
    <View style={[
      styles.row,{
        marginTop:11.43,
        marginLeft:24.29
      }]}>
      <ApIcon/>
      <Content/>
    </View>
    <View style={[
      styles.row,{
        marginTop:11.43,
        marginLeft:-30,
      }]}>
      <JsIcon/>
      <Content/>
    </View>
  </View>;
}

const Meet = ({ navigation }) => {
  const dispatch = useDispatch();
  const modalRef = useRef<BottomModalRef>(null);
  const user = useSelector((state:RootStateOrAny) => state.user);
  const normalizedMeetingList = useSelector((state:RootStateOrAny) => state.meeting.normalizedMeetingList);
  const meetingList = useMemo(() => {
    const meetingList = lodash.keys(normalizedMeetingList).map(m => {
      const meeting = normalizedMeetingList[m];
      const { room } = meeting;
      meeting.otherParticipants = lodash.reject(meeting.participants, p => p._id === user._id);
      room.otherParticipants =  meeting.otherParticipants;
      return meeting;
    });
    return lodash.orderBy(meetingList, 'updatedAt', 'desc');
  }, [normalizedMeetingList]);
  const {
    getMeetingList,
  } = useSignalr();
  const [loading, setLoading] = useState(false);
  const [sendRequest, setSendRequest] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [currentMeeting, setCurrentMeeting] = useState({
    channelId: '',
    isChannelExist: false,
    participants: [],
  });

  const onJoin = (item:IMeetings) => {
    openUrl(`/VideoCall?meetingId=${item._id}`);
  }

  const onVideoCall = () => {
    openUrl('/VideoCall');
  } 

  const onRequestData = () => setSendRequest(request => request + 1);

  const fetchMoreMeeting = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    const payload = { pageIndex };

    getMeetingList(payload, (err:any, res:any) => {
      if (res) {
        if (res.list) dispatch(addToMeetings(res.list));
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
      setFetching(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    let unMount = false;
    const payload = { pageIndex: 1 };

    getMeetingList(payload, (err:any, res:any) => {
      if (!unMount) {
        if (res) {
          dispatch(setMeetings(res.list));
          setPageIndex(current => current + 1);
          setHasMore(res.hasMore);
        }
        if (err) {
          setHasError(true);
          console.log('ERR', err);
        }
        setLoading(false);
      }
    });

    return () => {
      unMount = true;
    }
  }, [sendRequest])

  const mockChat = () => (
      <>
        <View style={styles.circle} />
        <View style={{ paddingLeft: 10 }}>
          <View style={{ borderRadius: RFValue(7), height: RFValue(7), width: sectionHeight, backgroundColor: '#B4DAFF' }} />
          <View style={{ borderRadius: RFValue(5), height: RFValue(5), width: sectionHeight, backgroundColor: 'white' }} />
          <View style={{ borderRadius: RFValue(7), height: RFValue(7), width: sectionHeight * 1.5, backgroundColor: '#DEE9FC' }} />
        </View>
      </>
  )

  const EmptyMeeting = () => (
      <View style={styles.emptyMeeting}>
        <View style={[styles.leftPosition, styles.shadow]}>
          {mockChat()}
        </View>
        <View style={[styles.rightPosition, styles.shadow]}>
          {mockChat()}
        </View>
        <View style={[styles.leftPosition, styles.shadow]}>
          {mockChat()}
        </View>
      </View>
  )

  const emptyComponent = () => (
      <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30,
            height: height - (width / 2)
          }}>
        {EmptyMeeting()}
        <Text
            color={'#34343F'}
            size={18}
            style={{ textAlign: 'center', marginTop: 30 }}
        >
          {'Get Started with Group\nmeetings'}
        </Text>
      </View>
  )

  const ListFooterComponent = () => {
    return (
        <ListFooter
            hasError={hasError}
            fetching={fetching}
            loadingText="Loading more meetings..."
            errorText="Unable to load meetings"
            refreshText="Refresh"
            onRefresh={() => fetchMoreMeeting(true)}
        />
    );
  }

  const renderItem = ({ item }) => {
    return (
        <Meeting
            name={getChannelName(item)}
            time={item.createdAt}
            participants={lodash.take(item?.room?.otherParticipants, 4)}
            others={lodash.size(item?.room?.otherParticipants) - 4}
            ended={item.ended}
            data={item}
            onJoin={() => onJoin(item)}
        />
    )
  }

  const checkSelectedItems = (selectedItem:any) => {
    if (lodash.size(selectedItem) === 1 && selectedItem[0].isGroup) {
      setCurrentMeeting({
        channelId: selectedItem[0]._id,
        isChannelExist: true,
        participants: selectedItem[0].participants,
      })
    } else {
      const tempParticipants:any = [];
      lodash.map(selectedItem, (item:any) => {
        if (item.isGroup) {
          lodash.map(item.participants, (p:IParticipants) => {
            const isExists = lodash.find(tempParticipants, (temp:IParticipants) => temp._id === p._id);
            if (!isExists) {
              tempParticipants.push(p);
            }
          })
        } else {
          const isExists = lodash.find(tempParticipants, (temp:IParticipants) => temp._id === item._id);
          if (!isExists) {
            tempParticipants.push(item);
          }
        }
      });

      setCurrentMeeting({
        channelId: '',
        isChannelExist: false,
        participants: tempParticipants,
      })
    }
  }
  const dimensions=useWindowDimensions();

  return (
      <View style={{flexDirection:"row",flex:1}}>
        <View style={[styles.meetingContainer,{
          flexBasis:(
                        isMobile||dimensions?.width<768) ? "100%" : 466,
          flexGrow:0,
          flexShrink:0
        }]}>
          <View style={styles.container}>
            <StatusBar barStyle={'light-content'}/>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                  <Text
                      color={'#113196'}
                      size={20}
                      style={{fontFamily:Bold,marginBottom:Platform.OS==='ios' ? 0 : -5}}
                  >
                    Meeting
                  </Text>

                </View>
                {/* <TouchableOpacity
                    onPress={onVideoCall}
                >
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <AddMeetingIcon
                      color={"#113196"}
                    />
                  </View>
                </TouchableOpacity> */}
              </View>
              <View  style={{paddingHorizontal: 24,paddingVertical: 46}}>
                <View style={{paddingBottom: 24}}>
                  <Text color={"#606A80"} size={16}>Get started</Text>
                </View>
                <TouchableOpacity onPress={onVideoCall}>
                  <View style={{paddingLeft: 17, alignItems: "center", flexDirection: "row", borderRadius: 10, borderWidth: 1,borderColor: "#E5E5E5", backgroundColor: "#fff", width: 303, height: 50}}>
                    <View style={{paddingRight: 12}}>
                      <VideoOutlineIcon/>
                    </View>
                    <Text size={20} color={"#606A80"}>Meet Now</Text>
                  </View>
                </TouchableOpacity>
                <View style={{paddingTop: 23}}>
                  <View style={{paddingLeft: 17, alignItems: "center", flexDirection: "row", borderRadius: 10, borderWidth: 1,borderColor: "#E5E5E5", backgroundColor: "#fff", width: 303, height: 50}}>
                    <View style={{paddingRight: 12}}>
                      <CalendarAddOutline/>
                    </View>
                    <Text size={20} color={"#606A80"}>Meet Later</Text>
                  </View>
                </View>

              </View>
            </View>

            {
              loading ? (
                  <View style={{alignItems:'center',marginTop:15}}>
                    <ActivityIndicator size={'small'} color={text.default}/>
                    <Text
                        style={{marginTop:10}}
                        size={14}
                        color={text.default}
                    >
                      Fetching meetings...
                    </Text>
                  </View>
              ) : (
                  <FlatList
                      data={meetingList}
                      refreshControl={
                        <RefreshControl
                            tintColor={primaryColor} // ios
                            progressBackgroundColor={primaryColor} // android
                            colors={['white']} // android
                            refreshing={loading}
                            onRefresh={onRequestData}
                        />
                      }
                      showsVerticalScrollIndicator={false}
                      renderItem={renderItem}
                      keyExtractor={(item:any)=>item._id}
                      ListFooterComponent={ListFooterComponent}
                      ItemSeparatorComponent={()=><View
                          style={{width:width-RFValue(60),height:1,backgroundColor:'#E5E5E5',alignSelf:'flex-end'}}/>}
                      onEndReached={()=>fetchMoreMeeting()}
                      onEndReachedThreshold={0.5}
                  />
              )
            }
            <BottomModal
                ref={modalRef}
                onModalHide={()=>modalRef.current?.close()}
                avoidKeyboard={false}
                header={
                  <View style={styles.bar}/>
                }
                containerStyle={{maxHeight:null}}
                onBackdropPress={()=>{
                }}
            >

              <View style={{
                paddingBottom:20,
                height:height*(
                    Platform.OS==='ios' ? 0.94 : 0.98)
              }}>
                {
                  isNext ? (
                      <View>

                        <CreateMeeting
                            participants={currentMeeting.participants}
                            onClose={()=>setIsNext(false)}
                            channelId={currentMeeting.channelId}
                            isChannelExist={currentMeeting.isChannelExist}
                            onSubmit={(params, data)=>{
                              modalRef.current?.close();
                              setParticipants([]);
                              setCurrentMeeting({
                                channelId: '',
                                isChannelExist: false,
                                participants: [],
                              })
                              setIsNext(false);
                              dispatch(setOptions({
                                ...params.options,
                                isHost: params.isHost,
                                isVoiceCall: params.isVoiceCall,
                              }));
                              setTimeout(() => dispatch(setMeeting(data)), 500);
                            }}
                        /></View>

                  ) : (
                      <MeetingParticipants
                          meetingPartticipants={participants}
                          onClose={()=>{
                            setParticipants([]);
                            modalRef.current?.close();
                          }}
                          onSubmit={(res:any)=>{

                            checkSelectedItems(res);
                            setParticipants(res);
                            setIsNext(true);
                          }}
                      />
                  )
                }
              </View>
            </BottomModal>
          </View>
        </View>
        <View style={{flex:1}}>
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <NoContent/>
            <View style={{paddingTop: 30}}>
              <Text size={24} color={"#A0A3BD"}>Meeting now or later</Text>
            </View>
          </View>
        </View>
      </View>

  )
}

export default Meet
