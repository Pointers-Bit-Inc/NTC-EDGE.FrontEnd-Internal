import {Animated as RNAnimated, Dimensions, Platform, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import axios, {CancelTokenSource} from "axios";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {BASE_URL} from "../services/config";
import {
    setCalendarVisible,
    setDateEnd,
    setDateStart,
    setFeesHighlight,
    setGetReport,
    setServices, setServicesHighlight
} from "../reducers/dashboard/actions";
import {setPrevDateEnd, setPrevDateStart} from "../reducers/application/actions";
import moment from "moment";
import {_colors, currency} from "../utils/ntc";
import * as React from "react";
import {lightPrimaryColor, primaryColor} from "@styles/color";

export function useReportFees() {
    const dimensions = useWindowDimensions();
    const cancelToken = useRef<CancelTokenSource>()
    const dispatch = useDispatch();
    const feesHighlight = useSelector((state: RootStateOrAny) => state.dashboard?.feesHighlight);
    const servicesHighlight = useSelector((state: RootStateOrAny) => state.dashboard?.servicesHighlight);
    const services = useSelector((state: RootStateOrAny) => state.dashboard?.services);
    const getReport = useSelector((state: RootStateOrAny) => state.dashboard?.getReport);
    const calendarVisible = useSelector((state: RootStateOrAny) => state.dashboard?.calendarVisible);
    const visible = useSelector((state: RootStateOrAny) => state.dashboard?.visible);
    const prevDateEnd = useSelector((state: RootStateOrAny) => state.dashboard?.prevDateEnd);
    const prevDateStart = useSelector((state: RootStateOrAny) => state.dashboard?.prevDateStart);
    const dateEnd = useSelector((state: RootStateOrAny) => state.dashboard?.dateEnd);
    const dateStart = useSelector((state: RootStateOrAny) => state.dashboard?.dateStart);
    const [animation] = useState(() => new RNAnimated.Value(0));
    const [modalVisible, setModalVisible] = useState(false);

    const user = useSelector((state: RootStateOrAny) => state.user);
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: user?.createdAt
        }
    };



    function query() {
        return {
            ...(
                {dateStart: dateStart?.toISOString()}),
            ...(
                {dateEnd: dateEnd?.toISOString()})
        }
    }

    const renderDot = color => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    useMemo(() => {
        return axios.get(BASE_URL + "/reports", {
            ...{cancelToken: cancelToken.current?.token},
            ...config,
            params: {...query()}
        }).then((res) => {
            dispatch(setServices(res.data))
        })
    }, []);


    const background = animation.interpolate({
        inputRange: [0, 0.2, 1.8, 2],
        outputRange: [
            'rgba(0,0,0,0)',
            'rgba(0,0,0,.3)',
            'rgba(0,0,0,.3)',
            'rgba(0,0,0,0)',
        ],
        extrapolate: 'clamp',
    });
    const display = animation.interpolate({
        inputRange: [0.2, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    const {height} = Dimensions.get('window');

    const success = animation.interpolate({
        inputRange: [1.1, 2],
        outputRange: [0, -height],
        extrapolate: 'clamp',
    });
    const onDateChange = (date, type) => {
        const momentDate = moment(date); // Convert to moment if necessary
        if(date){
            if (type === 'END_DATE') {
                let _date = momentDate.set({ hour: 23, minute: 59, second: 59 });
                dispatch(setDateEnd(_date));
            } else {
                if (momentDate.isValid()) {
                    let _date = momentDate.set({ hour: 23, minute: 59, second: 59 });
                    dispatch(setDateEnd(null));
                    dispatch(setDateStart(_date));
                }
            }
        }

    }

    const calendarPress = (getReport = false) => {
        dispatch(setPrevDateEnd(dateEnd));
        dispatch(setPrevDateStart(dateStart));
        if (!(dateEnd && dateStart)) {
            let _dateEnd = moment()?.set({"hour": 23, "minute": 59, "second": 59})
            let _dateStart = moment()?.set({"hour": 23, "minute": 59, "second": 59})
            dispatch(setDateEnd(_dateEnd));
            dispatch(setDateStart(_dateStart));
        }
        console.log(getReport)
        if(getReport == "cashier" ){

            dispatch(setGetReport("cashier"))
        }else if(getReport){
            dispatch(setGetReport(true))
        }else{
            dispatch(setGetReport(false))
        }

            dispatch(setCalendarVisible(true))

        RNAnimated.spring(animation, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    }
    function onDownloadDocument(doc) {
        var link = document.createElement('a');
        link.href = doc;
        link.download = 'file.pdf';
        link.dispatchEvent(new MouseEvent('click'));
        link?.remove();
    }


    const calendarConfirm = () => {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.current?.cancel("Operation canceled due to new request.")

        }
        setModalVisible(true)
        //Save the cancel token for the current request
        cancelToken.current = axios.CancelToken.source()
        axios.post(BASE_URL + "/reports/MISReport", {

        },  {...{cancelToken: cancelToken.current?.token},
            ...config,
            params: {...query()}}).then((res) => {
            if(Platform.OS == "web" ){
                onDownloadDocument(res.data)
            }
            setModalVisible(false)


        })
    }
    const cashierReportConfirm = () => {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.current?.cancel("Operation canceled due to new request.")

        }
        setModalVisible(true)
        //Save the cancel token for the current request
        cancelToken.current = axios.CancelToken.source()
        try {
            axios.post(BASE_URL + "/reports/CashierReport", {

            },  {...{cancelToken: cancelToken.current?.token},
                ...config,
                params: {...query()}}).then((res) => {
                if(Platform.OS == "web" ){
                    onDownloadDocument(res.data)
                }
            })
        }catch (e) {
            setModalVisible(false)
        }finally {
            setModalVisible(false)
        }

    }

    const calendarChangeData = () => {
        if (typeof cancelToken != typeof undefined) {
            cancelToken.current?.cancel("Operation canceled due to new request.")

        }
        //Save the cancel token for the current request
        cancelToken.current = axios.CancelToken.source()
        axios.get(BASE_URL + "/reports", {
            ...{cancelToken: cancelToken.current?.token},
            ...config,
            params: {...query()}
        }).then((res) => {
            dispatch(setServices(res.data))
        })
    }


    useMemo(() => {
        calendarChangeData()
    }, [dateStart?.toISOString(), dateEnd?.toISOString()])

    const minCols = 2;

    const calcNumColumns = (width) => {
        var cols = width / 300;


        const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
        const colsMinusMargin = cols - (2 * colsFloor * style.item.margin);
        if (colsMinusMargin < colsFloor && colsFloor > minCols) {
            return colsFloor - 1;
        } else return colsFloor;
    };

    const [numColumns, setNumColumns] = useState(calcNumColumns(dimensions.width));
    const [numFeeColumns, setNumFeeColumns] = useState(calcNumColumns(dimensions.width));


    useEffect(() => {


        if (dimensions.width) {
            setNumColumns(calcNumColumns(dimensions.width));
            setNumFeeColumns(calcNumColumns(dimensions.width));
        }

    }, [dimensions.width]);

    const renderItem = ({item, index}) => {
        if (item.empty) {
            return <View style={[style.item, style.itemTransparent]}/>;
        }
        return (
            <View style={[style.item, {margin: 6, padding: 15, borderRadius: 10,}, style.shadow]}>
        <View style={{backgroundColor:  item.svg.fill, height: 30, width: 30, borderRadius: 30 / 2}}></View>
        <Text style={style.itemText}><Text style={{fontWeight: "bold"}}>{item.service}</Text></Text>
        <Text>Count: {item.value}</Text>
        <Text>Total Fee: {currency(item.totalFee)}</Text>
        </View>
    );
    };
    const renderFeeItem = ({item, index}) => {
        if (item.empty) {
            return <View style={[style.item, style.itemTransparent]}/>;
        }
        return (
            <View style={[style.item, {margin: 6, padding: 15, borderRadius: 10,   borderWidth: 1,
                borderColor: feesHighlight == index ?  '#BFBEFC' : "transparent" },  style.shadow]}>
        <View style={{backgroundColor: item.svg.fill, height: 30, width: 30, borderRadius: 30 / 2}}></View>
        <Text style={style.itemText}><Text style={{fontWeight: "bold"}}>{item.name}</Text></Text>
        <Text>Total: {currency(item.value)}</Text>

        </View>
    );
    };


    const noService = useMemo(() => {
        var noservices = [
            {
                svg: {
                    fill: lightPrimaryColor
                },
                key: 1,
                value: 1
            }
        ]
        return noservices.map((c, i) => {
            return c
        })
    }, [services.fees, dimensions.width])


    const fees = useMemo(() => {

        return services.fees.map((c, i) => {
            c.svg = {
                fill: _colors[i],
                    onPress: () => dispatch(setFeesHighlight(i)),
            }
            c.key =`pie-${i}`
            return c
        }).sort((a, b) => b.value - a.value)
    }, [services.fees, dimensions.width])



    const feesTotal = useMemo(() => {

        return fees.reduce((total, service) => {
            return total + service.value
        }, 0)
    }, [fees, dimensions.width])


    const servicesMemo = useMemo(() => {

        return services.services.map((c, i) => {
            c.svg = {
                fill: _colors[i],
                onPress: () => dispatch(setServicesHighlight(i)),
            }
            c.key =`pie-service-${i}`
            c.name = c.service
            return c
        }).sort((a, b) => b.value - a.value)
    }, [services.services, dimensions.width])
    const servicesTotal = useMemo(() => {

        return servicesMemo.reduce((total, service) => {
            return total + service.value
        }, 0)
    }, [servicesMemo, dimensions.width])

    return {
        cashierReportConfirm,
        dimensions,
        dispatch,
        calendarVisible,
        visible,
        prevDateEnd,
        prevDateStart,
        dateEnd,
        dateStart,
        animation,
        background,
        display,
        success,
        onDateChange,
        calendarPress,
        calendarConfirm,
        calendarChangeData,
        getReport,
        numColumns,
        numFeeColumns,
        renderItem,
        renderFeeItem,
        fees,
        servicesMemo,
        renderDot,
        feesTotal,
        servicesTotal,
        noService,
        feesHighlight,
        servicesHighlight,
        modalVisible
    };
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
        paddingTop: 30,
        backgroundColor: '#ecf0f1',
    }, shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    item: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
        height: 120,
        width: 90
    },
    itemTransparent: {
        backgroundColor: 'transparent',
    },
    itemText: {
        textAlign: "center"
    },


});
