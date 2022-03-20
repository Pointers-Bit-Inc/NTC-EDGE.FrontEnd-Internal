import {useEffect, useState} from "react";
import {UserApplication} from "@pages/activities/interface";
import axios from "axios";
import {BASE_URL} from "../services/config";
import {Alert , InteractionManager} from "react-native";

export function useAssignPersonnel(assignedPersonnel, config) {


    const [personnel, setPersonnel] = useState<UserApplication>()
    const [prevPersonnel, setPrevPersonnel] = useState<UserApplication>()
    const [loading, setLoading] = useState<boolean>()
    const fetchData = async (isCurrent) => {
       InteractionManager.runAfterInteractions( async () => {
            setLoading(true)


            const _assignPersonnel = (assignedPersonnel?._id || assignedPersonnel)

            if(!_assignPersonnel) return

            await axios
                .get(BASE_URL + `/users/${_assignPersonnel}`, config)
                .then((res) => {
                         console.log("assignPersonnel", assignedPersonnel)
                        if(isCurrent){
                        setLoading(false)
                        setPersonnel(res.data);
                    }

                })
                .catch((err) => {
                    if(isCurrent){
                        setLoading(false)
                    }

                    Alert.alert('Alert' , err?.message || 'Something went wrong.');
                });
        })

    };
    useEffect(() => {
        let isCurrent = true
       fetchData(isCurrent);
        return () =>{
            isCurrent = false
        }
    }, [assignedPersonnel]);
    return {personnel, loading};
}