export  const formatDate = (date: string) => {

    date = checkFormatIso(date)
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}
export const checkFormatIso = (date: string, separator?: string) => {

    let isoStringSplit = date.split("T")[0].split("-")
    let checkIfCorrectMonth = isoStringSplit[2],
        checkIfCorrectDay = isoStringSplit[1]

    if (checkIfCorrectMonth.length == 3) {
        isoStringSplit[2] = checkIfCorrectMonth.substr(checkIfCorrectMonth.length - 2)
    }
    if (checkIfCorrectDay.length == 3) {
        isoStringSplit[1] = checkIfCorrectMonth.substr(checkIfCorrectDay.length - 2)
    }
    let newDate = ""
    for (let i = 0; i < isoStringSplit.length; i++) {
        newDate += isoStringSplit[i] + (i != isoStringSplit.length - 1 ? (separator ? separator : "/") : "")
    }
    return newDate
}