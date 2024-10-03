import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, FlatList, Text, Button, TextInput, View} from 'react-native';
import {HubConnectionBuilder, HubConnection, HttpTransportType} from "@microsoft/signalr";
import {BASE_URL} from "../../../services/config";
import {RootStateOrAny, useSelector} from "react-redux";

type Props = {};
type State = {
    hubConnection: HubConnection
}


const SignalR = () => {
    const user = useSelector((state:RootStateOrAny) => state.user);
    const signalr = useRef<HubConnection|null>(null);
    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState('');
    const [nick, setNick] = useState('')
    const [connectionStatus, setConnectionStatus] = useState('');
    const initSignalR = useCallback(async () => {
        signalr.current = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/applicationhub`, {
                transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
                accessTokenFactory: () => user.sessionToken,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'CreatedAt': `${user.createdAt}`,
                    'Authorization': `Bearer ${user.sessionToken}`
                }
            })
            .withAutomaticReconnect()
            .build();
        signalr.current.onclose(() => setConnectionStatus('disconnected'));
        signalr.current.onreconnected(() => setConnectionStatus('connected'));
        signalr.current.onreconnecting(() => setConnectionStatus('reconnecting'));
        signalr.current.start().then(() => setConnectionStatus('connected'));
    }, []);
    const destroySignalR = useCallback(() => {
        signalr.current?.stop();
    }, []);

    const onConnection = useCallback((connection, callback = () => {}) =>
            signalr.current?.on(connection, callback),
        []);


    useEffect(()=>{
        initSignalR();
        signalr.current.on('sendToChannel', (nick, message) => {

            const text = `${nick}: ${message}`;

            setMessages(message => [...message.concat(text)]);
        });
        return ()=>destroySignalR();
    },[]);

    function  sendMessage() {
        signalr.current
            .invoke('sendToChannel', nick, message)
            .catch(err => console.error(err));
        setMessage(message)
    }
    return <View style={styles.container}>
        <Text style={styles.welcome}>{connectionStatus} Welcome to Simple SignalR</Text>
        <TextInput
            placeholder={"Nick name"}
            style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => setNick(text)}
            value={nick}
        />
        <TextInput
            placeholder={"Message"}
            style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => setMessage(text)}
            value={message}
        />
        <Button
            onPress={sendMessage}
            title="Send"
            color="#841584"
        />
        <FlatList
          initialNumToRender={100}
            data={messages}
            renderItem={({item}) => <Text>{item}</Text>}
        />
    </View>
}


export  default SignalR


const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
    }, welcome: {
        fontSize: 20, textAlign: 'center', margin: 10,
    }, instructions: {
        textAlign: 'center', color: '#333333', marginBottom: 5,
    },
});
