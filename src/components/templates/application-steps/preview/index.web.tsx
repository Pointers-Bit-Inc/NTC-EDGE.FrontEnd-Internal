import React,{FC,useEffect,useState} from 'react';
import {
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    Modal,
    TouchableWithoutFeedback,useWindowDimensions, ActivityIndicator
} from 'react-native';
import Moment from 'moment';
import Text from '@atoms/text';
import { Bottom } from '@molecules/buttons';
import NavBar from '@organisms/navbar';
import { NTCPreview, transformText } from '../../../../utils/ntc';
import { text } from '@styles/color';
import styles from './styles';
import moment from 'moment';
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import {useComponentLayout} from "../../../../hooks/useComponentLayout";
import Check from "@atoms/icon/check";
import Close from "@atoms/icon/close";
import Receipt from "@atoms/icon/receipt";
import PDF from "@atoms/icon/pdf";
import Load from "@atoms/icon/load";
import NTCAlert from '@atoms/alert';
interface Props {
    navigation?: any;
    route?: any;
    application?: any;
    form?: any;
    pageOnly?: boolean;
    forApplication?: boolean;
};

function UploadRow(props:{fileName:any,preview:any,uri:any,onRequestClose:()=>void,serviceLayout:any}){
    const [modalVisible, setModalVisible] = useState(false);
    return <View style={styles?.fileContainer}>
        <Text style={styles?.fileText} numberOfLines={1}>
            {!!props.fileName ? props.fileName : "None provided"}
        </Text>
        {
            !!props.fileName&&
            <TouchableOpacity onPress={()=>{
                setModalVisible(true)
            }
            }>
                <Image
                    style={styles?.filePreview}
                    source={props.preview==="image" ? {uri:props.uri} : props.preview}
                />
            </TouchableOpacity>
        }
        <Modal transparent={true}
               visible={modalVisible}
               onRequestClose={() => setModalVisible(false)}>

            <View style={{flex:1,alignItems:"flex-end",}}>

                <View style={[{width:props.serviceLayout?.width}]}>
                    <View style={{alignSelf:"flex-end",zIndex:1,paddingHorizontal:15,paddingVertical:15}}>
                        <TouchableOpacity onPress={()=>{setModalVisible(false)}}>
                            <Text style={{color:"#fff", fontWeight: 600}}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width:props.serviceLayout?.width,flex:1,justifyContent:"center",alignItems:"center"}}>
                    <TouchableWithoutFeedback onPressOut={()=>{
                        setModalVisible(false)
                    }
                    }>
                        <View style={[{
                            width:props.serviceLayout?.width,
                            height:"100%",
                            alignItems:"center",
                            justifyContent:"center",
                            position:"absolute",
                            backgroundColor:"rgba(0, 0, 0, 0.5)"

                        }]}/>
                    </TouchableWithoutFeedback>
                    {props?.preview==="image" ? <Image
                        style={[{
                            width:props.serviceLayout?.width*0.8,
                            height:props.serviceLayout?.height*0.8
                        }]}
                        resizeMode={"contain"}
                        source={props.preview==="image" ? {uri:props.uri} : props.preview}
                    /> : <View>
                        <object
                            style={{zIndex:2,width:props?.serviceLayout?.width,
                                height:props?.serviceLayout?.height}}
                            data={'https://docs.google.com/gview?url='+props?.uri+'&embedded=true'}
                        >
                            <Text>Could not load Doc. Make sure the source is correct and the browser is not on device
                                mode.</Text>
                        </object>
                    </View>}
                </View>
            </View>
        </Modal>
    </View>;
}

const Preview: FC<Props> = ({
                                navigation,
                                route,
                                application,
                                form,
                                pageOnly,
                                forApplication,
                            }) => {
    const applicationItem=useSelector(state=>state?.service?.applicationItem);
    const myApplication = application || route?.params?.application || applicationItem;
    const [outputVisible, setOutputVisible] = useState(false);
    const [doc, setDoc] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState({});

    const [sizeComponent,onLayoutComponent]=useComponentLayout();
    const {serviceLayout}=useSelector((state:RootStateOrAny)=>state.service);

    const alert = () => {
        setAlertData({
            title: 'Claim',
            message: "Please proceed to the selected region's physical branch."
        });
        setTimeout(() => {
            setShowAlert(true);
        }, 100);
    };

    const onViewOutput = (pdf: string) => {
        if (myApplication?.service?.serviceCode === 'service-21') alert();
        else {
            setDoc(pdf);
            setTimeout(() => setOutputVisible(true), 500);
        }
    };

    const renderAlert = () => {
        return (
            <NTCAlert
                visible={showAlert}
                title={alertData?.title || 'Alert'}
                message={alertData?.message}
                confirmText='OK'
                onConfirm={() => setShowAlert(false)}
            />
        )
    };

    const renderViewOutput = () => {
        return (
            <Modal transparent={true}
                   visible={outputVisible}
                   onRequestClose={() => setOutputVisible(false)}
            >
                <View style={{flex:1,alignItems:"flex-end",}}>
                    <View style={[{width:serviceLayout?.width}]}>
                        <View style={{alignSelf:"flex-end",zIndex:1,paddingHorizontal:15,paddingVertical:15}}>
                            <TouchableOpacity onPress={()=>{setOutputVisible(false)}}>
                                <Text style={{color:"#fff", fontWeight: 600}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width:serviceLayout?.width,flex:1,justifyContent:"center",alignItems:"center"}}>
                        <TouchableWithoutFeedback onPressOut={()=>setOutputVisible(false)}>
                            <View style={[{
                                width:serviceLayout?.width,
                                height:"100%",
                                alignItems:"center",
                                justifyContent:"center",
                                position:"absolute",
                                backgroundColor:"rgba(0, 0, 0, 0.5)"

                            }]}/>
                        </TouchableWithoutFeedback>
                        <View>
                            <object
                                style={{
                                    zIndex:2,
                                    width:serviceLayout?.width,
                                    height:serviceLayout?.height
                                }}
                                data={'https://docs.google.com/gview?url='+doc+'&embedded=true'}
                            >
                                <Text>Could not load Doc. Make sure the source is correct and the browser is not on device
                                    mode.</Text>
                            </object>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    };

    const renderHeader = (header: string, secondary: boolean = false) => {
        return (
            <View style={[styles.tableHeadView, secondary && styles?.secondaryTableHeadView]}>
                <Text style={[styles.headerText, !secondary && styles.boldText]}>
                    {header}
                </Text>
            </View>
        )
    };

    const renderRow = (label: string, value: string) => {
        return (
            <View style={styles.row}>
                <Text style={styles.leftText}>{label}</Text>
                <View style={styles?.rightTextView}>
                    <Text style={styles.boldText}>{value}</Text>
                </View>

                {/*</View>*/}
            </View>
        )
    };

    const renderStatus = () => {
        let { approvalHistory = {}, paymentHistory = {} } = myApplication || {};
        let aStatus = approvalHistory?.status;
        let pStatus = paymentHistory?.status;
        let status = () => {
            if (aStatus !== 'Approved') return aStatus;
            else {
                if (aStatus !== 'Approved') return ;
                else return 'Approved';
            }
        };
        let action = () => {
            if (aStatus !== 'Approved') return aStatus;
            else {
                if (aStatus !== 'Approved') return pStatus;
                else return 'Approved';
            }
        };
        let statusColor = (_status: string = '') => {
            switch(_status || status()) {
                case 'Approved': return text.success;
                case 'Declined': return text.error;
                default: return text.warning;
            }
        };
        let icon = () => {
            switch(status()) {
                case 'Approved': return <Check color={statusColor()} size={15} />;
                case 'Declined': return <Close color={statusColor()} size={15} />;
                default: return <Load color={statusColor()} size={15} />;
            }
        };
        return (
            <View style={styles.tableContainer}>
                {renderHeader('STATUS')}
                <View style={styles.row}>
                    {icon()}
                    <Text style={[
                        styles.statusText,
                        styles.boldText,
                        {color: statusColor()},
                    ]}>{action()}</Text>
                </View>
                {
                    !!approvalHistory?.remarks &&
                    <View style={[styles?.remarksContainer, {borderColor: statusColor(aStatus)}]}>
                        <Text style={[styles?.remarksTitle, {color: statusColor(aStatus)}]}>{aStatus === 'Declined' ? 'NOD/' : ''}Remarks</Text>
                        <Text style={[styles?.remarksContent, {color: statusColor(aStatus)}]}>{approvalHistory?.remarks}</Text>
                    </View>
                }
                {
                    !!paymentHistory?.remarks &&
                    <View style={[styles?.remarksContainer, {borderColor: statusColor(pStatus)}]}>
                        <Text style={[styles?.remarksTitle, {color: statusColor(pStatus)}]}>{pStatus === 'Declined' ? 'NOD/' : ''}Remarks</Text>
                        <Text style={[styles?.remarksContent, {color: statusColor(pStatus)}]}>{paymentHistory?.remarks}</Text>
                    </View>
                }
            </View>
        )
    };
    const renderService = () => {
        let { name = '', applicationType = {} } = myApplication?.service || {};
        return (
            <View style={styles.tableContainer}>
                {renderHeader('APPLICATION')}
                <Text style={[styles.serviceText, styles.boldText]}>
                    {`${name}\n\n${applicationType?.label}${!!applicationType?.element ? `\n  • ${applicationType?.element}` : ''}`}
                </Text>
            </View>
        )
    };

    const renderOption = ({item, parentLabel}: any) => {
        return (
            <View style={item.hasSpecification && styles?.optionView}>
                {renderRow(parentLabel, item?.value)}
                {
                    item.hasSpecification &&
                    renderRow(transformText(item?.specification?.id), item?.specification?.value)
                }
            </View>
        )
    };

    const renderOptions = ({item}: any) => {
        const parentLabel = item?.label;
        return (
            <FlatList
              initialNumToRender={100}
                data={item?.items?.filter((i: any) => i?.selected) || []}
                renderItem={({item}) => renderOption({item, parentLabel})}
                keyExtractor={(item, index) => `${index}`}
            />
        )
    };

    const renderGrandchild = ({item, index, parentId}: any) => {
        var value = item?.alternativeValue || item?.value;
        var _form = [...form];
        const isOption = item?.type === 'option';
        if (isOption) { return renderOptions({item}); }
        if (item?.type === 'date') {
            let year = value?.find((v: any) => v?.id === 'year')?.value || Moment().get('year');
            let month = (`0${Number(value?.find((v: any) => v?.id === 'month')?.value || 0) + 1}`)?.slice(-2);
            let day = value?.find((v: any) => v?.id === 'day')?.value;
            value = year && month && day ? Moment(`${year}-${month}-${day}`).format('LL') : '';
        }
        if (item?.type === 'unit') {
            let measure = value?.[0]?.value;
            let unit = value?.[1]?.value;
            value = `${measure} ${unit}`;
        }
        else if (item?.type === 'time') value = moment(value).format('LT');
        else if (item?.specification && !isOption) item.hidden = true;
        else if (item?.hasSpecification && !isOption) {
            let arr = index >= 0 ? _form?.find((f: any) => f?.id === parentId)?.data?.[index] : _form?.find((f: any) => f?.id === parentId)?.data;
            value = `${item?.value} • ${arr?.find((f: any) => f?.id === `for-${item?.id}`)?.value}`;
        }

        if (item?.hidden) return <></>;
        if (typeof(value) === 'string') return renderRow(item?.label, value);
        else return <></>;
    };

    const renderSubChild = ({item, index, parentId}: any) => {
        return (
            <FlatList
              initialNumToRender={100}
                data={item}
                renderItem={({item}) => {
                    if (item?.isSet) return renderChild({item, parentId});
                    return renderGrandchild({item, index, parentId})
                }}
                keyExtractor={(item, index) => `${index}`}
            />
        )
    };

    const renderChild = ({item, parentId}: any) => {
        let isParentList = item?.type === 'list';
        if (item?.type === 'info') return <></>;
        return (
            <FlatList
              initialNumToRender={100}
                style={styles.tableContainer}
                data={item?.data}
                renderItem={({item, index}) => {
                    if (isParentList) return renderSubChild({item, index, parentId});
                    else return renderGrandchild({item, parentId})
                }}
                keyExtractor={(item, index) => `${index}`}
                ListHeaderComponent={() => renderHeader((item?.alternativeTitle || item?.title)?.toUpperCase())}
                ItemSeparatorComponent={() => {
                    if (isParentList) return (<View style={styles?.subChildSeparator} />)
                    else return <View />
                }}
            />
        )
    };

    const renderParent = () => {
        return (
            <FlatList
              initialNumToRender={100}
                data={form}
                renderItem={({item}) => renderChild({item, parentId: item?.id})}
                keyExtractor={(item, index) => `${index}`}
            />
        )
    };

    const renderUploadRow = ({item}: any) => {
        const fileName = forApplication ? item?.name : item?.small?.split('/')?.pop();
        const uri = forApplication ?   item?.links?.small : item?.links?.small;
        const preview = NTCPreview(fileName);
        return (
            <UploadRow
                fileName={fileName}
                preview={preview}
                uri={uri}
                onRequestClose={()=>{}}
                serviceLayout={serviceLayout}
            />
        )
    };

    const renderUploads = ({item, index}: any) => {
        return (
            <View>
                <Text style={[styles.boldText]}>{index + 1}. {item?.title}</Text>
                {
                    !!item?.description && <Text style={styles?.descriptionText}>{item?.description}</Text>
                }
                <FlatList
                  initialNumToRender={100}
                    style={styles.uploadFlatlist}
                    data={forApplication ? item?.files : item?.links}
                    renderItem={renderUploadRow}
                    keyExtractor={(item, index) => `${index}`}
                    ItemSeparatorComponent={() => <View style={styles?.uploadSeparator} />}
                    ListEmptyComponent={() => (
                        <View>
                            <Text style={styles?.fileText}>
                                None provided
                            </Text>
                        </View>
                    )}
                />
            </View>
        )
    };

    const renderDocumentsUploaded = () => {
        return (
            <View style={styles.tableContainer}>
                {renderHeader('DOCUMENTS UPLOADED')}
                <FlatList
                  initialNumToRender={100}
                    style={styles.uploadFlatlist}
                    data={myApplication?.service?.applicationType?.requirements}
                    renderItem={renderUploads}
                    keyExtractor={(item, index) => `${index}`}
                    ItemSeparatorComponent={() => <View style={styles?.uploadSeparator} />}
                />
            </View>
        )
    };

    const renderBasic = () => {
        let { companyName, applicantName, lastName, middleName, firstName, suffix, dateOfBirth, sex, nationality, weight, height } = myApplication?.service?.basic || {};
        let birthday = isNaN(dateOfBirth) ? '' : Moment(dateOfBirth).format('LL');
        if (lastName || middleName || firstName || suffix || birthday || sex || nationality || weight || height || companyName) {
            return (
                <View style={styles.tableContainer}>
                    {renderHeader('BASIC INFO')}
                    {!!companyName && renderRow('Company name:', companyName)}
                    {!!applicantName && renderRow('Representative:', applicantName)}
                    {!!lastName && renderRow('Last name:', lastName)}
                    {!!middleName && renderRow('Middle name:', middleName)}
                    {!!firstName && renderRow('First name:', firstName)}
                    {!!suffix && renderRow('Suffix:', suffix)}
                    {!!birthday && renderRow('Date of Birth:', birthday)}
                    {!!sex && renderRow('Sex:', sex)}
                    {!!nationality && renderRow('Nationality:', nationality)}
                    {!!weight && renderRow('Weight:', weight)}
                    {!!height && renderRow('Height:', height)}
                </View>
            )
        }
    };

    const renderAddress = () => {
        let { unit, street, barangay, province, city, zipCode } = myApplication?.applicant?.address || {};
        if (unit || street || barangay || province || city || zipCode) {
            return (
                <View style={styles.tableContainer}>
                    {renderHeader('ADDRESS')}
                    {!!unit && renderRow('Unit/Rm/House/Bldg. No.:', unit)}
                    {!!street && renderRow('Street:', street)}
                    {!!barangay && renderRow('Barangay:', barangay)}
                    {!!province && renderRow('Province:', province)}
                    {!!city && renderRow('City/Municipality:', city)}
                    {!!zipCode && renderRow('Zip Code:', zipCode)}
                </View>
            )
        }
    };

    const renderEducation = () => {
        let { schoolAttended, courseTaken, yearGraduated } = myApplication?.applicant?.education || {};
        if (schoolAttended || courseTaken || yearGraduated) {
            return (
                <View style={styles.tableContainer}>
                    {renderHeader('EDUCATIONAL BACKGROUND')}
                    {!!schoolAttended && renderRow('School Attended:', schoolAttended)}
                    {!!courseTaken && renderRow('Course Taken:', courseTaken)}
                    {!!yearGraduated && renderRow('Year Graduated:', yearGraduated)}
                </View>
            )
        }
    };

    const renderContact = () => {
        let { contactNumber, email } = myApplication?.applicant?.contact || {};
        if (contactNumber || email) {
            return (
                <View style={styles.tableContainer}>
                    {renderHeader('CONTACT DETAILS')}
                    {!!contactNumber && renderRow('Contact Number:', contactNumber)}
                    {!!email && renderRow('Email Address:', email)}
                </View>
            )
        }
    };

    const renderRegion = () => {
        if (myApplication?.region) {
            return (
                <View style={styles.tableContainer}>
                    {renderHeader('REGION')}
                    {renderRow('Region:', myApplication?.region || '')}
                </View>
            )
        }
    };

    const renderSchedule = () => {
        let { dateStart, dateEnd, venue, seatNumber } = myApplication?.schedule || {};
        if (dateStart || dateEnd || venue) {
            return (
                <View style={styles.tableContainer}>
                    {renderHeader('SCHEDULE')}
                    {!!dateStart && renderRow('Date:', moment(dateStart).format('ddd DD MMMM YYYY'))}
                    {!!dateStart && renderRow('Start Time:', moment(dateStart).format('LT'))}
                    {!!dateEnd && renderRow('End Time:', moment(dateEnd).format('LT'))}
                    {!!venue && renderRow('Venue:', venue)}
                    {!!seatNumber && renderRow('Seat No.:', seatNumber)}
                </View>
            )
        }
    };

    const renderServiceMiscellaneous = () => {
        let service = myApplication?.service || {};
        let _renderParent = ({item}: any) => {
            if (
                item !== 'basic' &&
                item !== '_id' &&
                item !== 'name' &&
                item !== 'applicationType' &&
                item !== 'serviceCode' &&
                item !== 'about' &&
                item !== 'createdAt' &&
                item !== 'requirements' &&
                item !== 'applicationTypes'
            ) {
                let parentItem = item;
                let date = new RegExp(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])$/)
                let parentLabel = transformText(item);
                let _renderGrandChild = (values: any, label: string = '') => {
                    let _renderGGChild = ({item, index}: any) => {
                        let childItem = item;
                        let childLabel = transformText(item);
                        let childValue = values?.[childItem];
                        childValue =  date?.test(childValue) && Date.parse(childValue) > 0 ? moment(childValue)?.format('LL') : childValue;

                        if (
                            !!childValue &&
                            typeof(childValue) === 'object'
                        ) {
                            let _renderGGGChild = ({item, index}: any) => {
                                let gchildItem = item;
                                let gchildLabel = transformText(item);
                                let gchildValue = childValue?.[gchildItem];
                                gchildValue =date?.test(gchildValue) &&  Date.parse(gchildValue) > 0 ? moment(gchildValue)?.format('LL') : gchildValue;
                                if (
                                    !!gchildValue &&
                                    typeof(gchildValue) === 'object'
                                ) {
                                    let _renderGGGGChild = ({item}: any) => {
                                        let ggchildItem = item;
                                        let ggchildLabel = transformText(item);
                                        let ggchildValue = gchildValue?.[ggchildItem];
                                        ggchildValue = date?.test(ggchildValue) &&  Date.parse(ggchildValue) > 0 ? moment(ggchildValue)?.format('LL') : ggchildValue;
                                        return renderRow(`${ggchildLabel}:`, ggchildValue);
                                    };
                                    return (
                                        <View style={styles.tableContainer}>
                                            {renderHeader(`${isNaN(Number(gchildLabel)) ? gchildLabel : transformText(childItem)} #${index + 1}`, true)}
                                            <FlatList
                                              initialNumToRender={100}
                                                data={Object.keys(gchildValue)}
                                                renderItem={_renderGGGGChild}
                                                keyExtractor={(item, index) => `${index}`}
                                                scrollEnabled={false}
                                                style={styles?.gggChildContainer}
                                            />
                                        </View>
                                    )
                                }

                                return renderRow(`${gchildLabel}:`, gchildValue);
                            };
                            return (
                                <View style={styles.tableContainer}>
                                    {renderHeader(isNaN(Number(label)) ? transformText(label) : transformText(childItem), true)}
                                    <FlatList
                                      initialNumToRender={100}
                                        data={Object.keys(childValue)}
                                        renderItem={_renderGGGChild}
                                        keyExtractor={(item, index) => `${index}`}
                                        scrollEnabled={false}
                                        style={styles?.gggChildContainer}
                                    />
                                </View>
                            )
                        }

                        return renderRow(`${childLabel}:`, childValue);
                    };
                    return (
                        <FlatList
                          initialNumToRender={100}
                            data={Object.keys(values)}
                            renderItem={_renderGGChild}
                            keyExtractor={(item, index) => `${index}`}
                            scrollEnabled={false}
                            style={[styles?.reviewContainer, styles?.reviewContainer2]}
                        />
                    )
                }
                let _renderChild = ({item}: any) => {
                    let childItem = item;
                    let childLabel = transformText(item);
                    let childValue = service?.[parentItem]?.[childItem];
                    childValue = date?.test(childValue) && Date.parse(childValue) > 0 ? moment(childValue)?.format('LL') : childValue;
                    if (typeof(childValue) === 'object' && !!childValue) return _renderGrandChild(childValue, childItem);
                    else return renderRow(`${childLabel}:`, childValue);
                };
                return (
                    <View style={styles.tableContainer}>
                        {renderHeader(parentLabel?.toUpperCase())}
                        <FlatList
                          initialNumToRender={100}
                            data={Object.keys(service[item])}
                            renderItem={_renderChild}
                            keyExtractor={(item, index) => `${index}`}
                            scrollEnabled={false}
                            ItemSeparatorComponent={(item) => {
                                return (
                                    <View style={service?.[parentItem]?.length > 0 && styles?.subChildSeparator} />
                                )
                            }}
                        />
                    </View>
                )
            }
        };
        return (
            <FlatList
              initialNumToRender={100}
                data={Object.keys(service)}
                renderItem={_renderParent}
                keyExtractor={(item, index) => `${index}`}
                scrollEnabled={false}
            />
        )
    };

    const renderNote = () => {
        return (
            <View style={styles?.noteView}>
                <Text style={styles?.noteText}>
                    Please note that ALL documents uploaded SHALL be presented to the venue before taking the exam.
                </Text>
            </View>
        )
    };

    const renderDataFromForm = () => {
        return renderParent();
    };
    const renderDataFromDB = () => {
        return (
            <>
                {renderBasic()}
                {renderAddress()}
                {renderEducation()}
                {renderContact()}
                {renderServiceMiscellaneous()}
            </>
        )
    };

    return (
        <>
            <View onLayout={onLayoutComponent} style={[styles.container, {flex: 1}]}>

                {
                    Platform.select({
                        native: !pageOnly &&
                            <NavBar
                                title='Preview'
                                leftIcon={<Close color='#fff' />}
                                onLeft={() => navigation.pop()}
                            />
                    })
                }

                <ScrollView showsVerticalScrollIndicator={true}>
                    <View style={styles.reviewContainer}>
                        {
                            !pageOnly &&
                            renderStatus()
                        }
                        {renderService()}
                        {
                            forApplication
                                ? form?.length > 0
                                    ? renderDataFromForm()
                                    : <View />
                                : renderDataFromDB()
                        }
                        {renderRegion()}
                        {
                            !!myApplication?.schedule && Object.keys(myApplication?.schedule)?.length > 0 &&
                            renderSchedule()
                        }
                        {renderDocumentsUploaded()}
                        {
                            myApplication?.service?.serviceCode === 'service-1' &&
                            renderNote()
                        }
                    </View>
                    <View style={pageOnly ? styles.bottomViewPageOnly : styles.bottomView} />
                </ScrollView>

                { /**<Bottom label='Proceed to Payment' /> */}

            </View>

            {
                myApplication?.approvalHistory?.status === 'Declined' &&
                <Bottom
                    label='Edit Application'
                    onPress={() => setTimeout(() => navigation.navigate('ApplicationSteps', {application: myApplication, edit: true}), 100)}
                    disabled={false}
                />
            }

            {
                myApplication?.approvalHistory?.status === 'Approved' &&
                myApplication?.paymentHistory?.status !== 'Approved' &&
                <Bottom
                    label='Order of Payment'
                    onPress={() => setTimeout(() => navigation.navigate('PaymentSOA', {application: myApplication}))}
                    disabled={false}
                />
            }

            {
                myApplication?.approvalHistory?.status === 'Approved' &&
                myApplication?.paymentHistory?.status === 'Approved' &&
                <Bottom
                    label='OR'
                    onPress={() => {
                        setDoc(myApplication?.officialReceipt?.pdf);
                        setTimeout(() => setOutputVisible(true), 500);
                    }}
                    disabled={false}
                    icon={(props: any) => <Receipt {...props} />}
                    label2='PDF'
                    onPress2={() => {
                        setDoc(myApplication?.document);
                        setTimeout(() => setOutputVisible(true), 500);
                    }}
                    disabled2={false}
                    icon2={(props: any) => <PDF {...props} />}
                />
            }

            {renderViewOutput()}
            {renderAlert()}
        </>
    )
};

export default Preview;
