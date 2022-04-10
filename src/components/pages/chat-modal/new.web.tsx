import React, { useState, useEffect, useRef } from 'react'
import {
    RefreshControl,
    ActivityIndicator,
    InteractionManager,
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Platform
} from 'react-native'
import lodash from 'lodash';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import { ContactItem, ListFooter, SelectedContact } from '@components/molecules/list-item';
import ChatView from "@components/pages/chat-modal/view"
import { ArrowRightIcon, ArrowDownIcon, CheckIcon, CloseIcon, NewGroupIcon, PlusIcon } from '@components/atoms/icon'
import { InputField, SearchField } from '@components/molecules/form-fields'
import { primaryColor, header } from '@styles/color';
import { Bold, Regular, Regular500 } from '@styles/font';
import useSignalr from 'src/hooks/useSignalr';
import { InputTags } from '@components/molecules/form-fields';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import AwesomeAlert from 'react-native-awesome-alerts';
import IParticipants from 'src/interfaces/IParticipants';
import EditIcon from "@assets/svg/editIcon";
import {isMobile} from "@pages/activities/isMobile";
import {fontValue} from "@pages/activities/fontValue";
import {useComponentLayout} from "../../../hooks/useComponentLayout";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    header: {
        zIndex: 999,
        backgroundColor: 'white'
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    input: {
        fontSize: fontValue(14),
        fontFamily: Regular,
        color: 'black',
        flex: 1,
    },
    outline: {
        borderWidth: 0,
        backgroundColor: '#EFF0F6',
        borderRadius: 10,
    },
    icon: {
        fontSize: fontValue(16),
        color: '#6E7191'
    },
    separator: {
        // height: StyleSheet.hairlineWidth,
        // width: width - 60,
        // alignSelf: 'flex-end',
        // backgroundColor: outline.default,
    },
    notSelected: {
        height: fontValue(20),
        width: fontValue(20),
        borderRadius: fontValue(20),
        borderWidth: 1,
        borderColor: button.default,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        height: fontValue(20),
        width: fontValue(20),
        borderRadius: fontValue(20),
        borderWidth: 1,
        borderColor: button.info,
        backgroundColor: button.info,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactTitle: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    outlineBorder: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
    },
    newGroupContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#EAEAF4',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    outlineText: {
        borderRadius: 10,
    },
    inputText: {
        fontSize: fontValue(16),
    },
    groupName: {
        height: undefined,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'white',
        marginBottom: -30,
        marginTop: 20,
        paddingHorizontal: 10
    },
    plus: {
        backgroundColor: button.info,
        borderRadius: fontValue(20),
        width: fontValue(20),
        height: fontValue(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        paddingLeft: Platform.OS === 'ios' ? 1 : 0,
        paddingTop: Platform.OS === 'ios' ? 1 : 0,
    },
    cancelText: {
        fontSize: fontValue(16),
        color: text.info,
        fontFamily: Regular500,
    },
    confirmText: {
        fontSize: fontValue(16),
        color: text.error,
        fontFamily: Regular500,
    },
    title: {
        color: '#14142B',
        textAlign: 'center',
        fontSize: fontValue(16),
        fontFamily: Regular500,
    },
    message: {
        color: '#4E4B66',
        textAlign: 'center',
        fontSize:fontValue(14),
        marginHorizontal: 15,
        marginBottom: 15,
        fontFamily: Regular,
    },
    content: {
        borderBottomColor: outline.default,
        borderBottomWidth: 1,
    }
});

const tagStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#D6D6D6',
    },
    container: {
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
    },
    tag: {
        borderRadius: 10,
    },
    textTag: {
        color: header.default,
        fontFamily: Bold,
        fontSize: fontValue(14),
    },
    input: {
        backgroundColor: '#FFFFFF',
        color: header.default,
        fontSize: fontValue(14),
        fontFamily: Bold,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -2
    },
});

const NewChat = ({ participants, setParticipants, onClose = () => {}, onSubmit = () => {} }:any) => {
    const {
        getParticipantList,
        createChannel,
        getChannelByParticipants,
    } = useSignalr();
    const dispatch = useDispatch();
    const inputRef:any = useRef(null);
    const inputTagRef:any = useRef(null);
    const groupNameRef:any = useRef(null);
    const [loading, setLoading] = useState(false);
    const [nextLoading, setNextLoading] = useState(false);
    const [sendRequest, setSendRequest] = useState(0);
    const [contacts, setContacts]:any = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [inputTagsLayout,onLayoutInputTags]=useComponentLayout();
    const { selectedChannel } = useSelector((state:RootStateOrAny) => state.channel);
    const user = useSelector((state:RootStateOrAny) => state.user);

    const onRequestData = () => setSendRequest(request => request + 1);

    const fetchMoreParticipants = (isPressed = false) => {
        if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
        setFetching(true);
        setHasError(false);
        const payload = searchValue ? { pageIndex, keyword: searchValue } : { pageIndex };

        getParticipantList(payload, (err:any, res:any) => {
            if (res) {
                setContacts([...contacts, ...res.list]);
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
        let unmount = false;
        setLoading(true);
        setPageIndex(1);
        setHasMore(false);
        setHasError(false);
        const payload = searchValue ? { pageIndex: 1, keyword: searchValue } : { pageIndex: 1 };

        if (!lodash.size(participants) || searchValue || isGroup || isFocused) {
            InteractionManager.runAfterInteractions(() => {
                getParticipantList(payload, (err:any, res:any) => {
                    if (!unmount) {
                        if (res) {
                            let resultList = res.list;

                            if (resultList && participants) {
                                resultList = lodash.reject(resultList, r => lodash.find(participants, p => p._id === r._id));
                            }

                            setContacts(resultList);
                            setPageIndex(current => current + 1);
                            setHasMore(res.hasMore);
                        }
                        if (err) {
                            console.log('ERR', err);
                        }
                        setLoading(false);
                    }
                });
            });
        } else {
            setLoading(false);
        }

        return () => {
            unmount = true;
        }
    }, [sendRequest, searchValue, isGroup, participants, isFocused]);

    useEffect(() => {
        let unmount = false;
        dispatch(setSelectedChannel({}));
        if (participants) {
            getChannelByParticipants({ participants }, (err:any, res:any) => {
                if (!unmount) {
                    if (res) {
                        dispatch(setSelectedChannel(res));
                    }
                    if (err) {
                        console.log('ERROR', err);
                    }
                }
            });
        }

        return () => {
            unmount = true;
        }
    }, [participants]);

    const onNext = (message:string, channelData = null) => {
        if (channelData) {
            onSubmit(channelData);
        } else {
            if (participants) {
                setNextLoading(true);
                const formData = new FormData();
                formData.append('name', groupName);
                formData.append('message', message);
                formData.append('participants', JSON.stringify(participants));

                createChannel(formData, (err:any, res:any) => {
                    setNextLoading(false);
                    if (res) {
                        onSubmit(res);
                    }
                    if (err) {
                        console.log('ERROR', err);
                    }
                });
            }
        }
    }

    const onBeforeClose = () => {
        if (isGroup) {
            setGroupName('');
            setIsGroup(false);
            setParticipants([]);
            inputRef.current?.focus();
        } else {
            if (lodash.size(participants) > 1) {
                setShowAlert(true);
            } else {
                onClose();
            }
        }
    }

    const onConfirmPressed = () => {
        setShowAlert(false);
        onClose();
    }

    const onSelectParticipants = (selectedId:string) => {
        const selected = lodash.find(contacts, c => c._id === selectedId);
        setParticipants(p => ([...p, selected]));
        if (!isGroup) {
            inputTagRef?.current?.addTag(selected);
            inputTagRef?.current?.blur();
            setSearchValue('');
        }
    }

    const onRemoveParticipants = (selectedId:string) => {
        const result = lodash.reject(participants, c => c._id === selectedId);
        setParticipants(result);
    }

    const onTapCheck = (selectedId:string) => {
        const isSelected = checkIfSelected(selectedId);
        if (isSelected) {
            if (isGroup) onRemoveParticipants(selectedId);
        } else {
            onSelectParticipants(selectedId);
        }
    }

    const checkIfSelected = (contactId:string) => {
        const selected = lodash.find(participants, c => c._id === contactId);
        return !!selected;
    }

    const onChangeTags = (tags:any) => {
        setParticipants(tags);
    };

    const renderTag = ({ tag, index, onPress, deleteTagOnPress, readonly }:any) => {
        return (
            <TouchableOpacity
                key={`${tag?._id}-${index}`}
                onPress={onPress}
                style={tagStyles.tag}>
                <Text style={tagStyles.textTag}>{tag?.firstName},</Text>
            </TouchableOpacity>
        );
    };

    const headerComponent = () => (
        <>
            <FlatList
                style={[styles.outlineBorder, !lodash.size(participants) && { borderBottomWidth: 0 }]}
                horizontal
                data={participants}
                renderItem={({ item }) => (
                    <SelectedContact
                        image={item?.profilePicture?.thumb}
                        name={item.name}
                        data={item}
                        onPress={() => onRemoveParticipants(item._id)}
                    />
                )}
                keyExtractor={(item) => item._id}
                ListFooterComponent={() => <View style={{ width: 20 }} />}
                ItemSeparatorComponent={() => <View style={{ width: fontValue(5) }} />}
                showsHorizontalScrollIndicator={false}
            />
            <View style={[styles.contactTitle, !!lodash.size(participants) && { paddingTop: 15 }]}>
                <ArrowDownIcon
                    style={{ marginTop: 2, marginRight: 3 }}
                    color={text.default}
                    size={24}
                />
                <Text
                    size={14}
                    color={'#606A80'}
                    style={{ fontFamily: Regular500 }}
                >
                    My contacts
                </Text>
            </View>
        </>
    )

    const emptyComponent = () => (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 30,
            }}>
            <Text
                color={text.default}
                size={14}
            >
                No matches found
            </Text>
        </View>
    )

    const ListFooterComponent = () => {
        return (
            <ListFooter
                hasError={hasError}
                fetching={fetching}
                loadingText="Loading more users..."
                errorText="Unable to load users"
                refreshText="Refresh"
                onRefresh={() => fetchMoreParticipants(true)}
            />
        );
    }

    const renderContactItem = ({ item }:any) => {
        if (isGroup) {
            return (
                <ContactItem
                    image={item?.profilePicture?.thumb}
                    data={item}
                    name={item.name}
                    onPress={() => onTapCheck(item._id)}
                    rightIcon={
                        <TouchableOpacity
                            onPress={() => onTapCheck(item._id)}
                        >
                            {
                                checkIfSelected(item._id) ? (
                                    <View style={styles.selected}>
                                        <CheckIcon
                                            type={'check1'}
                                            size={fontValue(16)}
                                            color="white"
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.notSelected} />
                                )
                            }
                        </TouchableOpacity>
                    }
                    contact={item.email || ''}
                />
            );
        }
        return (
            <ContactItem
                image={item?.profilePicture?.thumb}
                data={item}
                name={item.name}
                isOnline={item.isOnline}
                onPress={() => onTapCheck(item._id)}
                contact={item.email || ''}
            />
        )
    }

    const renderList = () => {
        if (isGroup || !lodash.size(participants) || searchValue || isFocused) {
            return (
                <View style={{ backgroundColor: "#fff",top: inputTagsLayout?.x * 1.8,  left: inputTagsLayout?.y , width: inputTagsLayout?.width, height: 376,  zIndex: 1, position: "absolute"}}>
                    <FlatList
                        data={contacts}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                tintColor={primaryColor} // ios
                                progressBackgroundColor={primaryColor} // android
                                colors={['white']} // android
                                refreshing={loading}
                                onRefresh={onRequestData}
                            />
                        }
                        renderItem={renderContactItem}
                        keyExtractor={(item) => item._id}
                        ItemSeparatorComponent={
                            () => <View style={styles.separator} />
                        }
                        ListHeaderComponent={isGroup ? headerComponent : undefined}
                        ListEmptyComponent={emptyComponent}
                        ListFooterComponent={ListFooterComponent}
                        onEndReached={() => fetchMoreParticipants()}
                        onEndReachedThreshold={0.5}
                        keyboardShouldPersistTaps={'handled'}
                    />
                   
                </View>

            );
        }

    }

    const onGroup = () => {
        setIsGroup(true);
        setIsFocused(false);
        setSearchValue('');
        setSearchText('');
        setContacts([]);
    }
    return (
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            <View style={styles.header}>
                <View style={[styles.horizontal, {  paddingVertical: 5, marginHorizontal: 15 }]}>
                    {
                        lodash.size(participants) > 1 && isGroup && (
                            <View style={{ position: 'absolute', right: 0, zIndex: 999 }}>
                                <TouchableOpacity
                                    disabled={!lodash.size(participants) || nextLoading}
                                    onPress={() => onNext("")}
                                >
                                    {
                                        nextLoading ? (
                                            <ActivityIndicator color={text.default} size={'small'} />
                                        ) : (
                                            <Text
                                                color={text.default}
                                                size={14}
                                                style={{ fontFamily: Regular500 }}
                                            >
                                                Create
                                            </Text>
                                        )
                                    }
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
                {
                    isGroup ? (
                        <View style={{ paddingHorizontal: 15 }}>
                            <InputField
                                ref={groupNameRef}
                                placeholder={'Group name'}
                                containerStyle={styles.groupName}
                                placeholderTextColor={'#C4C4C4'}
                                inputStyle={[styles.inputText, { backgroundColor: 'white' }]}
                                outlineStyle={[styles.outlineText, { backgroundColor: 'white' }]}
                                value={groupName}
                                onChangeText={setGroupName}
                                returnKeyType={'done'}
                            />
                            <SearchField
                                inputStyle={[styles.input]}
                                iconStyle={styles.icon}
                                placeholder="Search"
                                outlineStyle={[styles.outline]}
                                placeholderTextColor="#6E7191"
                                value={searchText}
                                onChangeText={setSearchText}
                                onChangeTextDebounce={setSearchValue}
                                onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
                            />
                        </View>
                    ) : (
                        <View style={{ borderBottomColor: "#EFEFEF", borderBottomWidth: 2}}>
                            <View style={{  paddingHorizontal: 33, paddingVertical: 25,flexDirection: 'row', justifyContent: 'center'}}>
                               <View style={{alignSelf: "center"}}>
                                   <Text
                                       color={text.default}
                                       size={14}
                                       style={{ fontFamily: Regular }}
                                   >
                                       To:
                                   </Text>
                               </View>


                                <View onLayout={onLayoutInputTags} style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", flex: 1, paddingLeft: 5, marginTop: Platform.OS === 'ios' ? 0 : -2 }}>

                                    <InputTags
                                        placeholder={"Enter Name"}
                                        ref={inputTagRef}
                                        placeholderTextColor={'#C4C4C4'}
                                        containerStyle={tagStyles.container}
                                        initialTags={participants}
                                        initialText={searchValue}
                                        inputStyle={[tagStyles.input, {fontFamily: searchValue ? Bold : Regular }]}
                                        onChangeTags={onChangeTags}
                                        renderTag={renderTag}
                                        onChangeTextDebounce={setSearchValue}
                                        onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                    />

                                {
                                    !searchValue && (
                                        <View style={{alignSelf: "center"}}>
                                            <TouchableOpacity onPress={() => inputTagRef?.current?.focus()}>
                                                <View style={styles.plus}>
                                                    <PlusIcon
                                                        color="white"
                                                        size={fontValue(12)}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    )
                                }
                                </View>
                                <View style={{paddingLeft: 32, alignSelf: "center"}}>
                                    <TouchableOpacity onPress={onGroup}>
                                        <View style={{ borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: "#F9F9F9", flexDirection: "row"}}>
                                            <EditIcon style={{paddingRight: 12}}/>
                                            <Text size={15}>Add group name</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>


                            </View>
                            {
                                !lodash.size(participants) && isMobile&& (
                                    <View style={styles.newGroupContainer}>
                                        <View style={{ alignContent: 'center', flexDirection: 'row' }}>
                                            <NewGroupIcon
                                                width={fontValue(22)}
                                                height={fontValue(22)}
                                                color={header.default}
                                            />
                                            <Text
                                                color={header.default}
                                                size={14}
                                                style={{ fontFamily: Regular500, marginLeft: 5 }}
                                            >
                                                Create new group
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={onGroup}
                                        >
                                            <ArrowRightIcon
                                                type='chevron-right'
                                                color={'#606A80'}
                                                size={fontValue(22)}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    )
                }
            </View>
                {renderList()}
            <ChatView
                channelId={selectedChannel?._id}
                otherParticipants={lodash.reject(selectedChannel.participants, (p:IParticipants) => p._id === user._id)}
                isGroup={selectedChannel.isGroup}
                groupName={groupName}
                lastMessage={selectedChannel.lastMessage}
                onNext={(message:string, data:any) => onNext(message, data)}
                participants={participants}
            />
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                contentContainerStyle={{ borderRadius: 15 }}
                title={'Discard group?'}
                titleStyle={styles.title}
                message={"Are you sure you would like to discard this group? your changes won't be saved"}
                messageStyle={styles.message}
                contentStyle={styles.content}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelButtonColor={'white'}
                confirmButtonColor={'white'}
                cancelButtonTextStyle={styles.cancelText}
                confirmButtonTextStyle={styles.confirmText}
                actionContainerStyle={{ justifyContent: 'space-around' }}
                cancelText="Cancel"
                confirmText="Discard"
                onCancelPressed={() => setShowAlert(false)}
                onConfirmPressed={onConfirmPressed}
            />
        </View>
    )
}

export default NewChat
