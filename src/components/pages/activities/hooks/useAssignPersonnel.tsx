import {useEffect, useState} from "react";
import {UserApplication} from "@pages/activities/interface";
import axios from "axios";
import {BASE_URL} from "../../../../services/config";

export function useAssignPersonnel(assignedPersonnel, config) {
    const [personnel, setPersonnel] = useState<UserApplication>()
    const [loading, setLoading] = useState<boolean>()
    const fetchData = () => {
        setLoading(true)
        axios
            .get(BASE_URL + `/user/profile/${assignedPersonnel}`, config)
            .then((res) => {
                setLoading(false)
                setPersonnel(res.data);
            })
            .catch((err) => {
                setLoading(false)
                console.log(err);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);
    return {personnel, loading};
}