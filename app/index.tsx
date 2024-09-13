import React, {useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor , store} from '@/src/services/store';
import Navigation from '@/src/navigations';
import TopModal from "@pages/activities/topmodal";
import {MenuProvider} from "react-native-popup-menu";
import {ToastProvider} from "@atoms/toast/ToastProvider";
import {Toast} from "@atoms/toast/Toast";
import {Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, useFonts} from "@expo-google-fonts/poppins";
export default function App() {
    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
    });
    useEffect(() => {
        if (fontsLoaded) {

        }
    }, [fontsLoaded]);

    return (
        <Provider store={ store }>
            <PersistGate loading={ null } persistor={ persistor }>
                <ToastProvider>
                    <StatusBar/>
                    <MenuProvider>

                        <Navigation/>
                    </MenuProvider>
                    <TopModal/>
                    <Toast />
                </ToastProvider>
            </PersistGate>
        </Provider>
    );
}
