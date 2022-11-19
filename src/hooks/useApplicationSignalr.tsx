import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect, useRef, useState} from "react";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BASE_URL} from "../services/config";
import {setPinnedApplication, setRealtimeCounts} from "../reducers/application/actions";

function useApplicationSignalr() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const realtimecounts = useSelector((state: RootStateOrAny) => state.application.realtimecounts);
    const signalr = useRef<HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState('');
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


    const onAddApplication = (id, data) => {
        const _r = realtimecounts+1
        dispatch(setRealtimeCounts(_r))
        dispatch(setPinnedApplication(JSON.parse(data)))
    }

    useEffect(() => {
        initSignalR();
        return () => destroySignalR();
    }, []);
    return {
        initSignalR,
        onAddApplication,
        onConnection,
        destroySignalR,
    };
}

export default useApplicationSignalr
