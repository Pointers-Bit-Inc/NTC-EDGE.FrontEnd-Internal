import React, {FC, memo, ReactElement, useEffect, useMemo, useRef, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import CaretDownIcon from "@assets/svg/caret-down";
import {useOrientation} from "../../../../hooks/useOrientation";

import {Regular,Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import {errorColor, outline, text} from "@styles/color";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setDropdownVisible} from "../../../../reducers/activity/actions";

interface Props {
    required: boolean,
    value: any;
        label: string;
        data: any;
        onSelect: (item: any) => void;
        loading: false
    }

    const CustomDropdown: FC<Props> = ({required, label, data, onSelect, value, loading}) => {

        const dimension = useWindowDimensions()
        const DropdownButton = useRef();
        const dispatch=useDispatch();

        const [visible, setVisible] = useState(false);
        const [selected, setSelected] = useState(undefined);
        const [dropdownTop, setDropdownTop] = useState(0);
        const [dropdownBottom, setDropdownBottom] = useState(0);
        const [dropdownHeight, setDropdownHeight] = useState(0);
        const [dropdownWidth, setDropdownWidth] = useState(0);
        const [dropdownLeft, setDropdownLeft] = useState(0);
        const [selectedIndex, setSelectedIndex] = useState(null)
        const toggleDropdown = (): void => {
            if(visible){
                dispatch(setDropdownVisible(false))

                setVisible(false)
            } {
                openDropdown();
            }
        };
        const valueMemo = useMemo(()=>{
            return value
        }, [value])
        useEffect(() => {

            let isCurrent = true
            const _selectedIndex = data?.findIndex((item) => item.value == valueMemo)

            if(isCurrent) setSelectedIndex(_selectedIndex)
            if(_selectedIndex != -1  ){
                const _selected = data[_selectedIndex]
                if(isCurrent) setSelected(_selected)
                if(data[_selectedIndex]) onSelect(data[_selectedIndex])
            }

              return () =>{
                  isCurrent = false
              }
        }, [selectedIndex, valueMemo, data?.length > 0])

        useEffect(()=>{
            let timer1 = setTimeout(() => {
                DropdownButton?.current?.measure((_fx:number,_fy:number,_w:number,h:number,_px:number,py:number)=>{

                    setDropdownWidth(_w);
                    setDropdownLeft(_px);
                    setDropdownTop((h + py) - (Platform.OS === 'ios' ? 0 : (StatusBar?.currentHeight || 0)));
                    setDropdownHeight(py)
                    setDropdownBottom((py));
                });
            }, 500);
            return () => {
                clearTimeout(timer1);
            };
        }, [visible, dropdownTop])

        const openDropdown = (): void => {
            dispatch(setDropdownVisible(true))

            setVisible(true);
        };
        const orientation = useOrientation()
        useEffect(()=>{
            dispatch(setDropdownVisible(false))
            setVisible(false);
        }, [orientation])
        const onItemPress = (item: any): void => {
            setSelected(item);
            onSelect(item);
            dispatch(setDropdownVisible(false))
            setVisible(false);
        };

        const renderItem = ({item}: any): ReactElement<any, any> => (
                <TouchableOpacity
                    style={[styles.item, {backgroundColor: item.value == selected?.value ? "#EAEAF4" : "rgba(255,255,255,0)",}]}
                    onPress={() => onItemPress(item)}>
                    <Text style={{

                        fontSize: fontValue(16)
                    }}>{item.label}</Text>
                </TouchableOpacity>
        );
        const renderDropdown = (): ReactElement<any, any> => {
            const flatListRef = useRef()

            return (
                <Modal
                        supportedOrientations={['portrait', 'landscape']}
                       visible={visible}
                       transparent
                       animationType="none">
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => {
                            dispatch(setDropdownVisible(false))
                            setVisible(false)
                        }}
                    >
                        {dropdownTop>0 && dropdownWidth > 0  && <View style={[styles.dropdown, { bottom: data?.length < 6   ? undefined  : "15%", width: dropdownWidth,flex: 1, left: dropdownLeft, top:  dropdownTop + 5}]}>
                            {data?.length > 0 ? <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.items}
                                data={data}

                                initialScrollIndex={selectedIndex || 0 || null}
                                ref={flatListRef}
                               onScrollToIndexFailed={info => {
                                const wait = new Promise(resolve => setTimeout(resolve, 100));
                                wait.then(() => {
                                    flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                                });
                            }}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            /> : <View style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
                                {loading ? <ActivityIndicator/> :<Text>No Data</Text>}
                            </View>}
                        </View>}
                    </TouchableOpacity>
                </Modal>
            );
        };
        return (
            <TouchableOpacity
                ref={DropdownButton}
                style={[styles.button, visible ? {borderWidth: 2,
                    borderColor: outline.primary,
                    backgroundColor: '#fff',} : {}]}
                onPress={toggleDropdown}
            >
                {renderDropdown()}
                <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    { Platform.OS == "web" ?
                        <View>
                            {(!!selected && selected?.label) ? <Text style={[styles.buttonText, {color: text.default,}]}>

                                {label} {(required ? <Text style={{color: errorColor}}>*</Text> : "")}
                            </Text> : null}
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.buttonText]}>

                                    {(!!selected && selected?.label) || label}
                                    <Text>{((!selected?.label) && required ? <Text style={{color: errorColor}}>*</Text> : "")}</Text>
                                </Text>

                            </View>

                        </View>  : <Text style={[styles.buttonText]}>

                            {(!!selected && selected?.label) || label}
                            <Text>{((!selected?.label) && required ? <Text style={{color: errorColor}}>*</Text> : "")}</Text>
                        </Text>
                    }

                    <View>
                        <CaretDownIcon width={fontValue(24)} height={fontValue(24)} style={{
                            paddingHorizontal: fontValue(20),
                            transform: [{
                                rotate: visible ? "0deg" : "180deg"
                            }]
                        }}/>
                    </View>

                </View>

            </TouchableOpacity>
        );
    };

    const styles = StyleSheet.create({
        items: {
            marginVertical: 10,
            marginHorizontal: 10,
            borderRadius: 5
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: '#EFF0F6',
            height: fontValue(50),
            zIndex: 1
        },
        buttonText: {
            flex: 1,
            fontSize: fontValue(12),
            //color: "#6E7191",
            color: "#15142a",
             fontFamily: Regular  ,
            paddingHorizontal: 20,
            textAlign: 'left',
        },
        icon: {
            marginRight: 10,
        },
        dropdown: {
           // overflow: "scroll",
            alignSelf: isMobile ? "center" : "flex-end",
            position: 'absolute',

            backgroundColor: "rgba(255,255,255,1)",
            borderWidth: 1,
            borderColor: "rgba(193,202,220,1)",
            shadowColor: "rgba(0,0,0,1)",
            shadowOffset: {
                width: 0,
                height: 0
            },
            elevation: 6,
            shadowOpacity: 0.2,
            shadowRadius: 2,
            borderRadius: 16,

        },
        overlay: {
            paddingHorizontal: 20,
            width: '100%',
            height: '100%',
        },
        item: {

            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 10,
        },
    });

    export default memo(CustomDropdown);
