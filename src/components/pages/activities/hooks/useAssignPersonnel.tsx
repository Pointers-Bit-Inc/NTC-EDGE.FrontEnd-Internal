import {useEffect, useState} from "react";
import {UserApplication} from "@pages/activities/interface";
import axios from "axios";
import {BASE_URL} from "../../../../services/config";

export function useAssignPersonnel(assignedPersonnel, config) {
    const [personnel, setPersonnel] = useState<UserApplication>()
    const [prevPersonnel, setPrevPersonnel] = useState<UserApplication>()
    const [loading, setLoading] = useState<boolean>()
    const fetchData = async () => {
        setLoading(true)

        await axios
            .get(BASE_URL + `/user/profile/${assignedPersonnel}`, config)
            .then((res) => {
                setLoading(false)
                setPersonnel(res.data);
                setPrevPersonnel(res.data);
            })
            .catch((err) => {
                setPersonnel(prevPersonnel);
                setLoading(false)
                console.log(err);
            });
    };
    useEffect(() => {
        let isCurrent = true
        if(isCurrent) fetchData();
        return () =>{
            isCurrent = false
        }
    }, [assignedPersonnel]);
    return {personnel, loading};
}