import {RootStateOrAny , useSelector} from "react-redux";
import {ACCOUNTANT , CASHIER , CHECKER , DIRECTOR , EVALUATOR} from "../reducers/activity/initialstate";

export const useUserRole = () => {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const cashier = [CASHIER].indexOf(user?.role?.key) != -1;
    const director = [DIRECTOR].indexOf(user?.role?.key) != -1;
    const evaluator = [EVALUATOR].indexOf(user?.role?.key) != -1;
    const checker = [CHECKER].indexOf(user?.role?.key) != -1;
    const accountant = [ACCOUNTANT].indexOf(user?.role?.key) != -1;
    return { user , cashier , director , evaluator , checker , accountant };
};