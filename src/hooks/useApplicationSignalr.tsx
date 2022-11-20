import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useRef, useState} from "react";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BASE_URL} from "../services/config";
import {
    setDecrementRealtimeCount,
    setDeletePinnedApplication,
    setPinnedApplication,
    setRealtimeCounts
} from "../reducers/application/actions";
import {Audio} from "expo-av";
import * as React from "react";

function useApplicationSignalr() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const realtimecounts = useSelector((state: RootStateOrAny) => state.application.realtimecounts);
    const signalr = useRef<HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState('');
    const soundRef:any=React.useRef(new Audio.Sound());

    const initSignalR = useCallback(async () => {
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
    const destroySignalR = useCallback(() => {
        signalr.current?.stop();
    }, []);

    const onConnection = useCallback((connection, callback = () => {
        }) =>
            signalr.current?.on(connection, callback),
        []);


    async function onAddApplication(id, data) {
        try {
            await soundRef.current?.loadAsync(require('@assets/sound/notification_sound.mp3'), {shouldPlay: true});
            await soundRef.current?.setIsLoopingAsync(false);
        } catch (e) {

        }
        dispatch(setRealtimeCounts(1))
        dispatch(setPinnedApplication(JSON.parse(data)))
    }

    function onDeleteApplication (id) {

        dispatch(setDecrementRealtimeCount(1))
        dispatch(setDeletePinnedApplication(id))
    }

    return {
        initSignalR,
        onAddApplication,
        onConnection,
        destroySignalR,
        onDeleteApplication
    };
}

export default useApplicationSignalr
