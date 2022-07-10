import {useEffect} from "react";

function useApplicantForm(props: any) {
    const applicantForm = (stateName, value) => {
        let newForm = {...props.userProfileForm}
        newForm[stateName] = value
        props.setUserProfileForm(newForm)
    }
    const updateApplication = () => {
        props?.updateApplication(() => {

        })

    }
    useEffect(() => {
        hasChanges()

    }, [props.userProfileForm])
    const hasChanges = () => {
        var hasChanges = false;

        for (const [key, value] of Object.entries(props.userOriginalProfileForm)) {

            if (props.userOriginalProfileForm?.[key] != props.userProfileForm?.[key]) {
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
