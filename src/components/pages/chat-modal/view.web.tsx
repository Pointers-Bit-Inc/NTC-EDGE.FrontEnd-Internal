import React, { useRef, useState, useCallback, useEffect, FC } from 'react'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    InteractionManager,
    Keyboard,
    Animated,
} from 'react-native'
import lodash from 'lodash';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import useSignalR from 'src/hooks/useSignalr';
import ChatList from '@pages/chat-modal/chat-list';
import {
    PlusIcon,
    CheckIcon,
    NewMessageIcon,
} from '@components/atoms/icon';
import { InputField } from '@components/molecules/form-fields';
import { button, header } from '@styles/color';
import {
    addPendingMessage,
    removeSelectedMessage,
    resetPendingMessages,
} from 'src/reducers/channel/actions';
import { RFValue } from 'react-native-responsive-fontsize';
import useAttachmentPicker from 'src/hooks/useAttachment';
import { AttachmentMenu } from '@components/molecules/menu';
import IMessages from 'src/interfaces/IMessages';
import IParticipants from 'src/interfaces/IParticipants';
import AttachIcon from "@assets/svg/AttachIcon";
import EmojiIcon from "@assets/svg/EmojiIcon";
import GifIcon from "@assets/svg/GifIcon";
import SendIcon from "@assets/svg/SendIcon";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        padding: 15,
        paddingTop: 40,
        paddingBottom: 5,
        backgroundColor: header.secondary,
    },
    horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    bubbleContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 4,
    },
    keyboardAvoiding: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        backgroundColor: '#f8f8f8',
    },
    containerStyle: {
        height: undefined,
        paddingVertical: 10,
        borderWidth: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    outline: {
        borderRadius: 10,
    },
    input: {
        fontSize: RFValue(16),
    },
    plus: {
        backgroundColor: button.info,
        borderRadius: RFValue(24),
        width: RFValue(24),
        height: RFValue(24),
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: Platform.OS === 'ios' ? 1 : 0,
        paddingTop: Platform.OS === 'ios' ? 1 : 0,
    },
    circle: {
        backgroundColor: button.info,
        borderRadius: 28,
        width: 28,
        height: 28,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingNotif: {},
    bar: {
        height: 15,
        width: 35,
        borderRadius: 4,
    },
});

interface Props {
    channelId: string,
    isGroup: boolean,
    groupName: string,
    lastMessage: IMessages,
    otherParticipants: Array<IParticipants>,
    onNext: Function;
    participants: Array<any>;
}

const ChatView: FC<Props> = ({
                                 channelId = '',
                                 isGroup = false,
                                 lastMessage = {},
                                 otherParticipants = [],
                                 onNext = () => {},
                                 participants = [],
                                 groupName = '',
                             }) => {
    const dispatch = useDispatch();
    const {
        editMessage,
    } = useSignalR();
    const {
        selectedFile,
        pickImage,
        pickDocument,
    } = useAttachmentPicker();
    const inputRef:any = useRef(null);
    const user = useSelector((state:RootStateOrAny) => state.user);
    const selectedMessage = useSelector((state:RootStateOrAny) => {
        const { selectedMessage } = state.channel;
        return selectedMessage[channelId];
    });
    const [inputText, setInputText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [rendered, setRendered] = useState(false);
    const [showAttachmentOption, setShowAttachmentOption] = useState(false);
    const Height = useRef(new Animated.Value(0));

    const _sendMessage = (channelId:string, inputText:string, groupName = '', participants:any = []) => {
        dispatch(addPendingMessage({
            channelId: channelId,
            message: inputText,
            groupName,
            participants,
            messageType: 'text',
        }));
    }

    const _sendFile = (channelId:string, attachment:any, groupName = '', participants:any = []) => {
        dispatch(addPendingMessage({
            attachment,
            channelId,
            groupName,
            participants,
            messageType: 'file'
        }));
    }

    const _editMessage = (messageId:string, message:string) => {
        editMessage({
            messageId,
            message,
        }, (err:any, result:any) => {
            if (err) {
                console.log('ERR', err);
            }
        })
    }

    const onSendMessage = useCallback(() => {
        if (!inputText || lodash.size(participants) === 0) {
            return;
        }
        if (selectedMessage?._id) {
            _editMessage(selectedMessage._id, inputText);
            inputRef.current?.blur();
            dispatch(removeSelectedMessage(channelId))
        } else {
            _sendMessage(channelId, inputText, groupName, participants);
            inputRef.current?.blur();
            setInputText('');
        }
    }, [channelId, inputText])

    const onShowAttachmentOption = () => {
        inputRef.current?.blur();
        setShowAttachmentOption(true);
    }

    const onHideAttachmentOption = () => {
        setShowAttachmentOption(false);
    }
    useEffect(() => {
       console.log("sending files")
        if (lodash.size(selectedFile)) {
            _sendFile(
                channelId,
                selectedFile,
                groupName,
                participants
            );
        }

    }, [selectedFile]);

    useEffect(() => {
        const animateTo = (y, duration) => Animated.timing(Height.current, { toValue: y, duration, useNativeDriver: false }).start();
        const showSubscription = Keyboard.addListener("keyboardDidShow", evt => {
            const height = evt.endCoordinates.height + (Platform.OS === 'ios' ? 0 : 25);
            animateTo(height, evt.duration);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", evt => {animateTo(0, evt.duration)});

        InteractionManager.runAfterInteractions(() => {
            setRendered(true);
        })

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
            dispatch(resetPendingMessages());
        }
    }, []);

    useEffect(() => {
        if (rendered) {
            setInputText(selectedMessage?.message || '');
            if (selectedMessage?._id) {
                setTimeout(() => inputRef.current?.focus(), 500);
            } else {
                inputRef.current?.blur();
            }
        }
    }, [selectedMessage, rendered]);


    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {
                    rendered && (
                        <ChatList
                            channelId={channelId}
                            isGroup={isGroup}
                            lastMessage={lastMessage}
                            otherParticipants={otherParticipants}
                            onNext={onNext}
                        />
                    )
                }
            </View>
            <View style={[{borderTopWidth: 2, paddingHorizontal: 32,paddingTop: 42, borderTopColor: "#efefef", backgroundColor:"#f8f8f8"}]}>
                <InputField
                        ref={inputRef}
                        placeholder={'Type a message'}
                        placeholderTextColor={'#C4C4C4'}
                        containerStyle={{borderColor: "#D1D1D6", backgroundColor: "white"}}
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={()=>inputText&&onSendMessage()}
                        returnKeyType={'send'}
                        onFocus={()=>setIsFocused(true)}
                        onBlur={()=>setIsFocused(false)}

                    />

                    <View style={{flexDirection: "row", justifyContent: "space-between", paddingBottom: 40}}>
                        <View style={{gap: 25, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={pickDocument}>
                                <AttachIcon/>
                            </TouchableOpacity>
                            <EmojiIcon/>
                            <TouchableOpacity onPress={pickImage}>
                                <GifIcon/>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity
                            disabled={!inputText}
                            onPress={onSendMessage}
                        >
                            {
                                selectedMessage?._id ? (
                                    <View style={[styles.plus, { marginRight: 0, marginLeft: 10, backgroundColor: button.info }]}>
                                        <CheckIcon
                                            type='check1'
                                            size={14}
                                            color={'white'}
                                        />
                                    </View>
                                ) : (
                                    <View style={{ marginLeft: 10 }}>
                                        <SendIcon/>
                                    </View>
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

        </View>
    )
}

export default ChatView
