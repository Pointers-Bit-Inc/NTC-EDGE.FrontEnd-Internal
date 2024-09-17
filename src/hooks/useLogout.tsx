import useOneSignal from "./useOneSignal";
import Api from "../services/api";
import {
    setApplicationItem,
    setApplications,
    setNotPinnedApplication,
    setPinnedApplication
} from "../reducers/application/actions";
import {setResetFilterStatus} from "../reducers/activity/actions";
import { resetUser, setCreatedAt } from '../reducers/user/actions';
import {resetMeeting} from "../reducers/meeting/actions";
import {resetChannel} from "../reducers/channel/actions";

function useLogout(user, dispatch){
    const { destroy } = useOneSignal(user);
    const logoutFn=()=>{
        const api=Api("", "");

        setTimeout(()=>{
            dispatch(setApplications([]))
            dispatch(setPinnedApplication([]))
            dispatch(setNotPinnedApplication([]))
            dispatch(setApplicationItem({}))
            dispatch(setResetFilterStatus([]))
            dispatch(resetUser());
            dispatch(resetMeeting());
            dispatch(setCreatedAt(null));
            dispatch(resetChannel());
            destroy();

        },500);
    }
    return logoutFn;
}


export default useLogout