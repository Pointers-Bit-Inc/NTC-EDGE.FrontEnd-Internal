import {useEffect, useState} from "react";
import {UserApplication} from "@pages/activities/interface";
import axios from "axios";
import {BASE_URL} from "../../../../services/config";
import {Alert} from "react-native";

export function useAssignPersonnel(assignedPersonnel, config) {
    const [personnel, setPersonnel] = useState<UserApplication>()
    const [prevPersonnel, setPrevPersonnel] = useState<UserApplication>()
    const [loading, setLoading] = useState<boolean>()
    const fetchData = async (isCurrent) => {
        setLoading(true)

        await axios
            .get(BASE_URL + `/user/profile/${assignedPersonnel}`, config)
            .then((res) => {
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