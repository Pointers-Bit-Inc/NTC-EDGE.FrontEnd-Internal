import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useRef, useState} from "react";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BASE_URL} from "../services/config";
import {
    setApplicationItem,
    setDecrementRealtimeCount,
    setDeletePinnedApplication, setModalVisible,
    setPinnedApplication,
    setRealtimeCounts
} from "../reducers/application/actions";
import {Audio, } from "expo-av";
import * as React from "react";
import {Platform} from "react-native";

function useApplicationSignalr() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const realtimecounts = useSelector((state: RootStateOrAny) => state.application.realtimecounts);
    const signalr = useRef<HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState('');
    const playbackInstance:any=React.useRef(null);
    const pinnedApplications = useSelector((state: RootStateOrAny) => {
        return state.application?.pinnedApplications
    });
    const initAppSignalR = useCallback(async () => {
        signalr.current = new HubConnectionBuilder()
            .withUrl(`${BASE_URL}/applicationhub`, {
                transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
                accessTokenFactory: () => user.sessionToken
            })
            .withAutomaticReconnect()
            .build();
        signalr.current.onclose(() => setConnectionStatus('disconnected'));
        signalr.current.onreconnected(() => setConnectionStatus('connected'));
        signalr.current.onreconnecting(() => setConnectionStatus('reconnecting'));
        signalr.current.start().then(() => setConnectionStatus('connected'));
    }, []);
    const destroyAppSignalR = useCallback(() => {
        signalr.current?.stop();
    }, []);

    const onAppConnection = useCallback((connection, callback = () => {
        }) =>
            signalr.current?.on(connection, callback),
        []);
    async function onUpdateApplication(id, data) {
        console.log("onUpdateApplication")


        let pinnedApplication = JSON.parse(data)
        pinnedApplication.state = "update"
        if(pinnedApplication?.region?.value){
            pinnedApplication.region = pinnedApplication.region?.value
        }

        dispatch(setPinnedApplication(pinnedApplication))
    }

    async function onAddApplication(id, data) {
        console.log("onAddApplication")
        try {
            try {
                if (playbackInstance?.current != null) {
                    await playbackInstance?.current?.unloadAsync();
                    // this.playbackInstance.setOnPlaybackStatusUpdate(null);
                    playbackInstance.current = null;
                }
                const { sound, status } = await Audio.Sound.createAsync(
                    require('@assets/sound/notification_sound.mp3'),
                    {shouldPlay: true}
                );

                playbackInstance.current = sound;


            }catch (e){
                console.log(e)
            }
            if(Platform.OS == "web"){
                if (!("Notification" in window)) {

                    alert("This browser does not support desktop notification");
                } else if (Notification.permission === "granted") {

                    // if so, create a notification
                    const notification = new Notification(`New Application ${(id?.slice(0,6))} added`, {icon:  require('@assets/electron.png')});
                    // …
                } else if (Notification.permission !== "denied") {

                    Notification.requestPermission().then((permission) => {

                        if (permission === "granted") {
                            const notification = new Notification(`New Application ${(id?.slice(0,6))} added`, {icon:  require('@assets/electron.png')});
                            // …
                        }
                    });
                }
            }


        } catch (e) {
            console.log(e)
        }


        let pinnedApplication = JSON.parse(data)
        pinnedApplication.state = "add"
        if(pinnedApplication?.region?.value){
            pinnedApplication.region = pinnedApplication.region?.value
        }

        dispatch(setRealtimeCounts(1))
        dispatch(setPinnedApplication(pinnedApplication))
    }
    useEffect(()=>{
        return  () => {
            destroyAppSignalR()
            playbackInstance.current?.unloadAsync()
        }
    }, [])


    async function onDeleteApplication(id, data) {
        try {
            try {
                if (playbackInstance?.current != null) {
                    await playbackInstance?.current?.unloadAsync();
                    // this.playbackInstance.setOnPlaybackStatusUpdate(null);
                    playbackInstance.current = null;
                }
                const {sound, status} = await Audio.Sound.createAsync(
                    require('@assets/sound/delete.mp3'),
                    {shouldPlay: true}
                );

                console.log(status, "status")
                playbackInstance.current = sound;
            } catch (e) {
                console.log(e)
            }


        } catch (e) {
            console.log(e)
        }
        try {

            let pinnedApplication = JSON.parse(data)
            pinnedApplication.state = "delete"
            if(pinnedApplication?.region?.value){
                pinnedApplication.region = pinnedApplication.region?.value
            }

            dispatch(setPinnedApplication(pinnedApplication))

        } catch (e) {
            console.log(e, "catch")
        }
        new Promise((resolve, reject) => {
            setTimeout(() => {


                resolve() // when this fires, .then gets called

            }, 3000)
        }).then(() => {
            dispatch(setDecrementRealtimeCount(1))
            dispatch(setDeletePinnedApplication(id))
        })

    }

    return {
        initAppSignalR,
        onAddApplication,
        onUpdateApplication,
        onAppConnection,
        destroyAppSignalR,
        onDeleteApplication
    };
}

export default useApplicationSignalr
