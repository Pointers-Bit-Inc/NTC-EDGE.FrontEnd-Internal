import React, { FC, useEffect, useState } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity ,Image, Alert, Platform, BackHandler, Linking } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { WebView } from 'react-native-webview';
import Moment from 'moment';
import Text from '@atoms/text';
import NavBar from '@organisms/navbar';
import { NTCPreview, transformText } from '../../../../utils/ntc';
import { text } from '@styles/color';
import styles from './styles';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bottom } from '@molecules/buttons';
import Check from "@atoms/icon/check";
import Close from "@atoms/icon/close";
import Load from "@atoms/icon/load";
import Receipt from "@atoms/icon/receipt";
import PDF from "@atoms/icon/pdf";

interface Props {
  navigation?: any;
  route?: any;
  application?: any;
  form?: any;
  pageOnly?: boolean;
  forApplication?: boolean;
};

const Preview: FC<Props> = ({
  navigation,
  route,
  application,
  form,
  pageOnly,
  forApplication,
}) => {
  const [filelink, setFileLink] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const myApplication = application || route?.params?.application;

  const onViewOutput = (_d: string) => Linking.openURL(`https://docs.google.com/gview?url=${_d}&embedded=true`);

  const onBack = () => {
    if (showWebView) setShowWebView(false);
    navigation?.pop();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, []);

  const _onPreview = (filepath: string) => {
    filepath = filepath?.replace('file://', '');
    const openFile = (_filepath: string) => {
      FileViewer.open(_filepath)
      .then(() => {})
      .catch((error) => {
        Alert.alert('Alert', `Cannot show file preview. ${error?.message}`);
      });
    };
    if (filepath.match('http')) {
      // setFileLink(filepath);
      // setShowWebView(true);
      Linking.openURL(filepath);

      // for download
      // const filename = filepath?.split('/')?.pop();
      // const localFile = `${RNFS.DocumentDirectoryPath}/${filename}`;
      // const options = {
      //   fromUrl: filepath,
      //   toFile: localFile,
      // };
      // RNFS
      //   .downloadFile(options)
      //   .promise
      //   .then(() => openFile(localFile))
      //   .then(() => {})
      //   .catch((error) => {
      //     Alert.alert('Alert', `Cannot show file preview. ${error?.message}`);
      //   });
    }
    else openFile(filepath);
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
    else if (item?.type === 'time') {
      value = moment(value).format('LT');
    }
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
        data={form}
        renderItem={({item}) => renderChild({item, parentId: item?.id})}
        keyExtractor={(item, index) => `${index}`}
      />
    )
  };

  const renderUploadRow = ({item}: any) => {
    const small = item?.links?.small || item?.small;
    const fileName = small ? small?.split('/')?.pop() : item?.name;
    const uri = small || item?.uri;
    const preview = NTCPreview(fileName);

    return (
      <View style={styles?.fileContainer}>
        <Text style={styles?.fileText} numberOfLines={1}>
          {!!fileName ? fileName : 'None provided'}
        </Text>
        {
          !!fileName &&
          <TouchableOpacity onPress={() => _onPreview(uri)}>
            <Image
              style={styles?.filePreview}
              source={preview === 'image' ? {uri} : preview}
            />
          </TouchableOpacity>
        }
      </View>
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
          style={styles.uploadFlatlist}
          data={item?.links || item?.files}
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
        let parentLabel = transformText(item);
        let _renderGrandChild = (values: any, label: string = '') => {
          let _renderGGChild = ({item, index}: any) => {
            let childItem = item;
            let childLabel = transformText(item);
            let childValue = values?.[childItem];
            childValue = Date.parse(childValue) > 0 ? moment(childValue)?.format('LL') : childValue;

            if (
              !!childValue &&
              typeof(childValue) === 'object'
            ) {
              let _renderGGGChild = ({item, index}: any) => {
                let gchildItem = item;
                let gchildLabel = transformText(item);
                let gchildValue = childValue?.[gchildItem];
                gchildValue = Date.parse(gchildValue) > 0 ? moment(gchildValue)?.format('LL') : gchildValue;
                if (
                  !!gchildValue &&
                  typeof(gchildValue) === 'object'
                ) {
                  let _renderGGGGChild = ({item}: any) => {
                    let ggchildItem = item;
                    let ggchildLabel = transformText(item);
                    let ggchildValue = gchildValue?.[ggchildItem];
                    ggchildValue = Date.parse(ggchildValue) > 0 ? moment(ggchildValue)?.format('LL') : ggchildValue;
                    return renderRow(`${ggchildLabel}:`, ggchildValue);
                  };
                  return (
                    <View style={styles.tableContainer}>
                      {renderHeader(`${isNaN(Number(gchildLabel)) ? gchildLabel : transformText(childItem)} #${index + 1}`, true)}
                      <FlatList
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
          childValue = Date.parse(childValue) > 0 ? moment(childValue)?.format('LL') : childValue;
          if (typeof(childValue) === 'object' && !!childValue) return _renderGrandChild(childValue, childItem);
          else return renderRow(`${childLabel}:`, childValue);
        };
        return (
          <View style={styles.tableContainer}>
            {renderHeader(parentLabel?.toUpperCase())}
            <FlatList
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
  }

  const renderWebView = () => {
    return (
      <SafeAreaView style={styles?.webViewContainer}>
        <WebView
          source={{ uri: filelink }}
          useWebKit={true}
        />
        <TouchableOpacity onPress={() => setShowWebView(false)}>
          <View style={styles?.webViewTab}>
            <Text style={styles?.webViewTabText}>OK</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
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

  if (showWebView) return renderWebView();

  return (
    <>
    <View style={styles.container}>

      {
        Platform.select({
          native: !pageOnly &&
            <NavBar
              title='Preview'
              leftIcon={<Close color='#fff' />}
              onLeft={() => navigation?.pop()}
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
        onPress={() => onViewOutput(myApplication?.officialReceipt?.pdf)}
        disabled={false}
        icon={(props: any) => <Receipt {...props} />}
        label2='PDF'
        onPress2={() => onViewOutput(myApplication?.document)}
        disabled2={false}
        icon2={(props: any) => <PDF {...props} />}
      />
    }
    </>
  )
};

export default Preview;
