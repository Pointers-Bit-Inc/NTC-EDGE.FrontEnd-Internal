import {Animated as RNAnimated, Dimensions, Platform, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import axios, {CancelTokenSource} from "axios";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {BASE_URL} from "../services/config";
import {setCalendarVisible, setDateEnd, setDateStart, setGetReport, setServices} from "../reducers/dashboard/actions";
import {setPrevDateEnd, setPrevDateStart} from "../reducers/application/actions";
import moment from "moment";
import {_colors} from "../utils/ntc";
import * as React from "react";

export function useReportFees() {
    const dimensions = useWindowDimensions();
    const cancelToken = useRef<CancelTokenSource>()
    const dispatch = useDispatch();
    const services = useSelector((state: RootStateOrAny) => state.dashboard?.services);
    const getReport = useSelector((state: RootStateOrAny) => state.dashboard?.getReport);
    const calendarVisible = useSelector((state: RootStateOrAny) => state.dashboard?.calendarVisible);
    const visible = useSelector((state: RootStateOrAny) => state.dashboard?.visible);
    const prevDateEnd = useSelector((state: RootStateOrAny) => state.dashboard?.prevDateEnd);
    const prevDateStart = useSelector((state: RootStateOrAny) => state.dashboard?.prevDateStart);
    const dateEnd = useSelector((state: RootStateOrAny) => state.dashboard?.dateEnd);
    const dateStart = useSelector((state: RootStateOrAny) => state.dashboard?.dateStart);
    const [animation] = useState(() => new RNAnimated.Value(0));

    const user = useSelector((state: RootStateOrAny) => state.user);
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
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
        if (type === 'END_DATE') {
            let _date = date?.set({"hour": 23, "minute": 59, "second": 59})
            dispatch(setDateEnd(_date));
        } else {
            let _date = date?.set({"hour": 0, "minute": 0})
            dispatch(setDateEnd(null));
            dispatch(setDateStart(_date));
        }
    }

    const calendarPress = (getReport = false) => {
        dispatch(setPrevDateEnd(dateEnd));
        dispatch(setPrevDateStart(dateStart));
        if (!(dateEnd && dateStart)) {
            let _dateEnd = moment()?.set({"hour": 23, "minute": 59, "second": 59})
            let _dateStart = moment()?.set({"hour": 0, "minute": 0})
            dispatch(setDateEnd(_dateEnd));
            dispatch(setDateStart(_dateStart));
        }

        if(getReport){
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
        axios.post(BASE_URL + "/reports/pdf", {
            ...{cancelToken: cancelToken.current?.token},
            ...config,
            params: {...query()}
        }).then((res) => {
            if(Platform.OS == "web" ){
                onDownloadDocument(res.data)
            }



        })
    }

    const calendarChangeData = () => {
        axios.get(BASE_URL + "/reports", {
            ...{cancelToken: cancelToken.current?.token},
            ...config,
            params: {...query()}
        }).then((res) => {
            dispatch(setServices(res.data))
        })
    }

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
        <View style={{backgroundColor: item.color, height: 30, width: 30, borderRadius: 30 / 2}}></View>
        <Text style={style.itemText}><Text style={{fontWeight: "bold"}}>Service: </Text>{item.service}</Text>
        <Text>Count: {item.value}</Text>
        <Text>Total Fee: {item.totalFee}</Text>
        </View>
    );
    };

    const renderFeeItem = ({item, index}) => {
        if (item.empty) {
            return <View style={[style.item, style.itemTransparent]}/>;
        }
        return (
            <View style={[style.item, {margin: 6, padding: 15, borderRadius: 10,}, style.shadow]}>
        <View style={{backgroundColor: item.color, height: 30, width: 30, borderRadius: 30 / 2}}></View>
        <Text style={style.itemText}><Text style={{fontWeight: "bold"}}>Name: </Text>{item.name}</Text>
        <Text>Total: {item.value}</Text>
        </View>
    );
    };


    const fees = useMemo(() => {

        return services.fees.map((c, i) => {
            c.color = _colors[i]
            return c
        })
    }, [services.fees, dimensions.width])


    const servicesMemo = useMemo(() => {

        return services.services.map((c, i) => {
            c.color = _colors[i]
            c.name = c.service
            return c
        })
    }, [services.services, dimensions.width])
    return {
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
        renderDot
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
    },


});
