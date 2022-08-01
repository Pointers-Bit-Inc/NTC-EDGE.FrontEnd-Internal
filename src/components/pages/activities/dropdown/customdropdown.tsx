import React,{FC,ReactElement,useEffect,useRef,useState} from 'react';
import {
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
import {outline} from "@styles/color";

interface Props {
        label: string;
        data: any;
        onSelect: (item: any) => void;
    }

    const CustomDropdown: FC<Props> = ({label, data, onSelect, value}) => {
        const dimension = useWindowDimensions()
        const DropdownButton = useRef();
        const [visible, setVisible] = useState(false);
        const [selected, setSelected] = useState(undefined);
        const [dropdownTop, setDropdownTop] = useState(0);
        const [dropdownBottom, setDropdownBottom] = useState(0);
        const [dropdownHeight, setDropdownHeight] = useState(0);
        const [dropdownWidth, setDropdownWidth] = useState(0);
        const [dropdownLeft, setDropdownLeft] = useState(0);
        const [selectedIndex, setSelectedIndex] = useState(null)
        const toggleDropdown = (): void => {
            visible ? setVisible(false) : openDropdown();
        };
        useEffect(() => {
            let isCurrent = true
            const _selectedIndex = data?.findIndex((item) => item.value == value)

            if(isCurrent) setSelectedIndex(_selectedIndex)
            if(_selectedIndex != null && _selectedIndex != undefined ){
                const _selected = data[_selectedIndex]
                if(isCurrent) setSelected(data[_selectedIndex])
                if(data[_selectedIndex]) onSelect(data[_selectedIndex])
            }

              return () =>{
                  isCurrent = false
              }
        }, [data, value, selectedIndex])

        useEffect(()=>{

            DropdownButton?.current?.measure((_fx:number,_fy:number,_w:number,h:number,_px:number,py:number)=>{

                setDropdownWidth(_w);
                setDropdownLeft(_px);
                setDropdownTop((h + py) - (Platform.OS === 'ios' ? 0 : (StatusBar?.currentHeight || 32)));
                setDropdownHeight(py)
                setDropdownBottom((py));
            });
        }, [visible, dropdownTop])

        const openDropdown = (): void => {


            setVisible(true);
        };
        const orientation = useOrientation()
        useEffect(()=>{
            setVisible(false);
        }, [orientation])
        const onItemPress = (item: any): void => {
            setSelected(item);
            onSelect(item);
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
                        onPress={() => setVisible(false)}
                    >
                        {dropdownTop>0 && dropdownWidth > 0  && <View style={[styles.dropdown, { bottom: data?.length < 6   ? undefined  : "15%", width: dropdownWidth,flex: 1, left: dropdownLeft, top:  dropdownTop + 5}]}>
                            {data?.length > 0 ? <FlatList
                                showsVerticalScrollIndicator={false}
                                style={styles.items}
                                data={data}
                                initialScrollIndex={selectedIndex || 0 || null}
                                ref={flatListRef}
                                onScrollToIndexFailed={ ({
                                                             index ,
                                                             averageItemLength ,
                                                         }) => {
                                    flatListRef.current?.scrollToOffset({

                                        offset : index * averageItemLength ,
                                        animated : false ,
                                    });
                                } }
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            /> : <View style={{height: "100%", justifyContent: "center", alignItems: "center"}}>
                                <Text>No Data</Text>
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
                <Text style={[styles.buttonText]}>
                    {(!!selected && selected?.label) || label}
                </Text>
                <CaretDownIcon style={{
                    paddingHorizontal: 20,
                    transform: [{
                        rotate: visible ? "0deg" : "180deg"
                    }]
                }}/>
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
            height: 50,
            zIndex: 1
        },
        buttonText: {
            flex: 1,
            color: "#6E7191",
             fontFamily: Regular  ,
            paddingHorizontal: 20,
            textAlign: 'left',
        },
        icon: {
            marginRight: 10,
        },
        dropdown: {

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

    export default CustomDropdown;
