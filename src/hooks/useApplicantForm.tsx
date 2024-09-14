import {useEffect} from "react";
import {RootStateOrAny, useSelector} from "react-redux";

function useApplicantForm(props: any) {
    const userOriginalProfileForm = useSelector((state: RootStateOrAny) => state.application.userOriginalProfileForm);
    const userProfileForm = useSelector((state: RootStateOrAny) => state.application.userProfileForm);

    const applicantForm = (stateName, value) => {
        let newForm = {...userProfileForm}
        newForm[stateName] = value
        props.setUserProfileForm(newForm)
    }
    const updateApplication = () => {
        props?.updateApplication(() => {

        })

    }
    useEffect(() => {
        hasChanges()

    }, [userProfileForm])
    const hasChanges = () => {
        var hasChanges = false;

        for (const [key, value] of Object.entries(userOriginalProfileForm)) {

            if (userOriginalProfileForm?.[key] != userProfileForm?.[key]) {
                hasChanges = true

                props.hasChanges(hasChanges)
                return
            } else {
                hasChanges = false
                props.hasChanges(hasChanges)
            }
        }
    }
    return {applicantForm, updateApplication};
}


export default useApplicantForm
