import React, { FC } from 'react';
import {FlatList,View,TouchableOpacity,Platform} from 'react-native';
import SectionList from 'react-native-tabs-section-list';
import Text from '@atoms/text';
import DynamicField from '@organisms/forms/fields/dynamic';
import styles from './styles';
import { button, text } from '@styles/color';
import { RFValue } from 'react-native-responsive-fontsize';
import Button from '@components/atoms/button';
import Plus from "@atoms/icon/plus";
import Close from "@atoms/icon/close";
import Dot from "@atoms/icon/dot";

interface Props {
    form?: any;
    onChangeValue?: any;
    onAdd?: any;
    onRemove?: any;
    onUseDifferentAddress?: any;
    useDifferentAddress?: any;
};

const ServicesForm: FC<Props> = ({
                                     form = [],
                                     onChangeValue = () => {},
                                     onAdd = () => {},
                                     onRemove = () => {},
                                     onUseDifferentAddress = () => {},
                                     useDifferentAddress,
                                 }) => {



    const renderField = ({parentId, item, index, type, setParentId, setParentIndex, setIndex}: any) => {
        return (
            <DynamicField
                parentId={parentId}
                index={index}
                {...item}
                onChangeValue={onChangeValue}
                parentType={type}
                setParentId={setParentId}
                setParentIndex={setParentIndex}
                setIndex={setIndex}
            />
        )
    };

    const renderSection = ({item, section, index}: any) => {
        let parentId = section?.id;
        let setParentIndex = index;
        let renderAddBtn = () => {
            if (index + 1 >= section?.data?.length) {
                return (
                    <Button
                        style={styles?.addBtnContainer}
                        onPress={() => onAdd({
                            parentId,
                            template: section?.template,
                        })}
                    >
                        <Plus color='#fff' />
                    </Button>
                )
            }
            return <View />
        };
        let renderRemoveBtn = () => {
            if (section?.data?.length > 1) {
                return (
                    <Button
                        style={[styles?.addBtnContainer, styles?.removeBtnContainer]}
                        onPress={() => onRemove({parentId, index})}
                    >
                        <Close color='#fff' />
                    </Button>
                )
            }
            return <View />
        };
        let renderFooter = () => {
            return (
                <View style={styles?.footerContainer}>
                    {renderAddBtn()}
                    {renderRemoveBtn()}
                </View>
            )
        };
        if (section?.type === 'info') {
            return (
                <>
                    {
                        !!item?.title &&
                        <Text style={styles?.infoTitle}>{item?.title}</Text>
                    }
                    {
                        !!item?.message &&
                        <Text style={styles?.infoMessage}>{item?.message}</Text>
                    }
                </>
            )
        }
        else if (section?.type === 'list') {
            return (
                <FlatList
                    style={styles?.listFieldContainer}
                    data={item}
                    renderItem={({item, index}) => {
                        let setParentItem = item;
                        if (item?.isSet) {
                            if (item?.type === 'list') {
                                return (
                                    <FlatList
                                        style={styles?.setMainView}
                                        data={item?.data}
                                        renderItem={({item, index}) => {
                                            let _renderAddBtn = () => {
                                                if ((index + 1) >= setParentItem?.data?.length) {
                                                    return (
                                                        <Button
                                                            style={styles?.addBtnContainer}
                                                            onPress={() => onAdd({
                                                                parentId,
                                                                template: setParentItem?.template,
                                                                setParentId: setParentItem?.id,
                                                                setParentIndex,
                                                            })}
                                                        >
                                                            <Plus color='#fff' />
                                                        </Button>
                                                    )
                                                }
                                                return <View />
                                            };
                                            let _renderRemoveBtn = () => {
                                                if (setParentItem?.data?.length > 1) {
                                                    return (
                                                        <Button
                                                            style={[styles?.addBtnContainer, styles?.removeBtnContainer]}
                                                            onPress={() => onRemove({
                                                                parentId,
                                                                index,
                                                                setParentId: setParentItem?.id,
                                                                setParentIndex,
                                                            })}
                                                        >
                                                            <Close color='#fff' />
                                                        </Button>
                                                    )
                                                }
                                            };
                                            let _renderFooter = () => {
                                                return (
                                                    <View style={[styles?.footerContainer, styles?.footerContainer2]}>
                                                        {_renderAddBtn()}
                                                        {_renderRemoveBtn()}
                                                    </View>
                                                )
                                            };
                                            return (
                                                <FlatList
                                                    style={styles?.setSubView}
                                                    data={item}
                                                    renderItem={({item}) => {
                                                        return renderField({
                                                            parentId,
                                                            item,
                                                            index: setParentIndex,
                                                            type: 'list',
                                                            setParentId: setParentItem?.id,
                                                            setIndex: index,
                                                        });
                                                    }}
                                                    keyExtractor={(item, index) => `${index}`}
                                                    ListFooterComponent={_renderFooter}
                                                    ListHeaderComponent={() => (
                                                        <View>
                                                            <Text style={styles?.headerText}>{setParentItem?.title} (No. {index + 1})</Text>
                                                        </View>
                                                    )}
                                                />
                                            )
                                        }}
                                        keyExtractor={(item, index) => `${index}`}
                                    />
                                )
                            }
                            else {
                                return (
                                    <FlatList
                                        style={styles?.setMainView}
                                        data={item?.data}
                                        renderItem={({item}) => {
                                            return renderField({
                                                parentId,
                                                item,
                                                index: setParentIndex,
                                                type: 'list',
                                                setParentId: setParentItem?.id,
                                            });
                                        }}
                                        keyExtractor={(item, index) => `${index}`}
                                        ListHeaderComponent={() => (
                                            <View>
                                                <Text style={styles?.headerText}>{item?.title}</Text>
                                            </View>
                                        )}
                                    />
                                )
                            }
                        }

                        return renderField({parentId, item, index: setParentIndex, type: 'list'})
                    }}
                    keyExtractor={(item, index) => `${index}`}
                    ListFooterComponent={renderFooter}
                />
            )
        }
        return renderField({item, parentId});
    };

    const renderSectionTitle = ({section}: any) => {
        return (
            <>
                {
                    !!section?.title &&
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={styles?.headerText}>{section?.title}</Text>
                        {
                            section?.id === 'address' &&
                            <TouchableOpacity onPress={onUseDifferentAddress}>
                                <Text style={styles?.headerTextTouch}>Use {!!useDifferentAddress ? 'same' : 'different'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                }
            </>
        )
    };

    const renderTabMenu = ({ title, alternativeTitle, isActive, data, type }: any) => {
        let isComplete = true;
        let isParentList = type === 'list';
        data.forEach((child: any) => {
            if (isParentList) {
                child?.forEach((subChild: any) => {
                    if (subChild?.isSet) {
                        subChild.data?.forEach((child: any) => {
                            let isParentList = subChild?.type === 'list';
                            if (isParentList) {
                                child?.forEach((subChild: any) => {
                                    if (subChild?.required) {
                                        if (child.type === 'time') {}
                                        else if (subChild?.type === 'option') {
                                            let selectedItems = subChild?.items?.filter((i: any) => i?.selected);
                                            selectedItems?.forEach((item: any) => {
                                                if (item?.hasSpecification) {
                                                    if (
                                                        item?.specification?.required &&
                                                        !(
                                                            !item?.specification?.error &&
                                                            item?.specification?.value
                                                        )
                                                    ) {
                                                        isComplete = false;
                                                        return;
                                                    }
                                                }
                                            });
                                            if (isComplete && selectedItems?.length < subChild?.minimum) {
                                                isComplete = false;
                                                return;
                                            }
                                        }
                                        else {
                                            if (!subChild?.value) {
                                                isComplete = false;
                                                return;
                                            }
                                            if (typeof(subChild?.value) === 'object' && !!subChild?.value) {
                                                subChild?.value?.forEach((_d: any) => {
                                                    if (!(_d?.value && _d?.isValid)) {
                                                        isComplete = false;
                                                        return;
                                                    }
                                                });
                                            }
                                            else if (!(subChild?.value && subChild?.isValid)) {
                                                isComplete = false;
                                                return;
                                            }
                                        }
                                    }
                                });
                            }
                            else {
                                if (child.required) {
                                    if (child.type === 'time') {}
                                    else if (child?.type === 'option') {
                                        let selectedItems = child?.items?.filter((i: any) => i?.selected);
                                        selectedItems?.forEach((item: any) => {
                                            if (item?.hasSpecification) {
                                                if (
                                                    item?.specification?.required &&
                                                    !(
                                                        !item?.specification?.error &&
                                                        item?.specification?.value
                                                    )
                                                ) {
                                                    isComplete = false;
                                                    return;
                                                }
                                            }
                                        });
                                        if (isComplete && selectedItems?.length < child?.minimum) {
                                            isComplete = false;
                                            return;
                                        }
                                    }
                                    else {
                                        if (!child?.value) {
                                            isComplete = false;
                                            return;
                                        }
                                        if (typeof(child?.value) === 'object' && !!child?.value) {
                                            child?.value?.forEach((_d: any) => {
                                                if (!(_d?.value && _d?.isValid)) {
                                                    isComplete = false;
                                                    return;
                                                }
                                            });
                                        }
                                        else if (!(child?.value && child?.isValid)) {
                                            isComplete = false;
                                            return;
                                        }
                                    }
                                }
                            }
                        });
                    }
                    else if (subChild?.required) {
                        if (child.type === 'time') {}
                        else if (subChild?.type === 'option') {
                            let selectedItems = subChild?.items?.filter((i: any) => i?.selected);
                            selectedItems?.forEach((item: any) => {
                                if (item?.hasSpecification) {
                                    if (
                                        item?.specification?.required &&
                                        !(
                                            !item?.specification?.error &&
                                            item?.specification?.value
                                        )
                                    ) {
                                        isComplete = false;
                                        return;
                                    }
                                }
                            });
                            if (isComplete && selectedItems?.length < subChild?.minimum) {
                                isComplete = false;
                                return;
                            }
                        }
                        else {
                            if (!subChild?.value) {
                                isComplete = false;
                                return;
                            }
                            if (typeof(subChild?.value) === 'object' && !!subChild?.value) {
                                subChild?.value?.forEach((_d: any) => {
                                    if (!(_d?.value && _d?.isValid)) {
                                        isComplete = false;
                                        return;
                                    }
                                });
                            }
                            else if (!(subChild?.value && subChild?.isValid)) {
                                isComplete = false;
                                return;
                            }
                        }
                    }

                });
            }
            else {
                if (child.required) {
                    if (child.type === 'time') {}
                    else if (child?.type === 'option') {
                        let selectedItems = child?.items?.filter((i: any) => i?.selected);
                        selectedItems?.forEach((item: any) => {
                            if (item?.hasSpecification) {
                                if (
                                    item?.specification?.required &&
                                    !(
                                        !item?.specification?.error &&
                                        item?.specification?.value
                                    )
                                ) {
                                    isComplete = false;
                                    return;
                                }
                            }
                        });
                        if (isComplete && selectedItems?.length < child?.minimum) {
                            isComplete = false;
                            return;
                        }
                    }
                    else {
                        if (!child?.value) {
                            isComplete = false;
                            return;
                        }
                        if (typeof(child?.value) === 'object' && !!child?.value) {
                            child?.value?.forEach((_d: any) => {
                                if (!(_d?.value && _d?.isValid)) {
                                    isComplete = false;
                                    return;
                                }
                            });
                        }
                        else if (!(child?.value && child?.isValid)) {
                            isComplete = false;
                            return;
                        }
                    }
                }
            }
        });
        return (
            <View style={form?.length > 4 ? styles?.tabViewContainerMoreThan4 : styles?.tabViewContainer4}>
                <View
                    style={[
                        styles?.tabView,
                        isActive && { borderBottomWidth: RFValue(3) },
                    ]}
                >
                    <Text size={
                        Platform.select({
                            web: 20
                        })
                    } color={ Platform.select({
                        native:isActive ? text.primary : text.disabled,
                        web: isActive ?   text.info : text.disabled
                    })}>
                        {alternativeTitle || title}
                    </Text>
                    {
                        !isComplete &&
                        <Dot size={5} color='red' />
                    }
                </View>
            </View>
        )
    };

    return (
        <SectionList
            showsVerticalScrollIndicator={false}
            style={styles.container}
            sections={form}
            keyExtractor={(item, index) => `${index}`}
            stickySectionHeadersEnabled={false}
            tabBarStyle={styles?.tabBar}
            renderTab={(item: any) => renderTabMenu(item)}
            renderSectionHeader={({ section }) => renderSectionTitle({section})}
            renderItem={renderSection}
            ListFooterComponent={() => <View style={styles.bottomView} />}
        />
    )
};

export default ServicesForm;
