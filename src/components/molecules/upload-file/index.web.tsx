import React, { FC, useState } from 'react';
import {
	View,
	TouchableOpacity,
	FlatList,
	ImageBackground,
	Platform,
	TouchableWithoutFeedback,
	Image,
	Modal
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import FileViewer from 'react-native-file-viewer';
import Button from '@atoms/button';
import { AnimatedModal } from '@atoms/modals';
import Text from '@atoms/text';
import ProgressBar from '@atoms/progress-bar';
import { defaultColor, disabledColor, infoColor, text } from '@styles/color';
import { NTCPreview } from '../../../utils/ntc';
import styles from './styles';
import {isMobile} from '../../../utils/formatting';
import {RootStateOrAny,useSelector} from 'react-redux';
import Close from "@atoms/icon/close";
import Upload from "@atoms/icon/upload";
import FileAdd from "@atoms/icon/file-add";

interface Props {
	onUpload?: any;
	onRemove?: any;
	defaultFile?: any;
	defaultFiles?: any;
	uploading?: boolean;
	uploaded?: boolean;
	disabled?: boolean;
	uploadText?: string;
	raw?: boolean;
	photoOnly?: boolean;
};

const UploadFile: FC<Props> = ({
	photoOnly = false,
	raw = false,
	onUpload = () => {},
	onRemove = () => {},
	uploadText = 'Upload a file..',
	disabled = false,
	defaultFile,
	defaultFiles,
	uploading = false,
	uploaded = false,
}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [modalFile, setModalFile] = useState({});
	const [file, setFile] = useState(defaultFile);
	const [files, setFiles] = useState(defaultFiles);
	const [visible, setVisible] = useState(false);
	const { serviceLayout } = useSelector((state:RootStateOrAny) => state.service);
	const multipleFiles = files?.length > 0;

	const _onUpload = (_file: any) => {
		delete _file?.type;
		if (multipleFiles) {
			let _files = [...files];
			_files.push(_file);
			setFiles(_files);
		}
		else setFile(_file);
		onUpload(_file);
	};

	const _onTakePhoto = () => {
		_onUploadPhoto(true);
	};

	const _onUploadPhoto = async (isTakePhoto: boolean = false) => {
		let _f = isTakePhoto === true
			? await ImagePicker.launchCameraAsync({ presentationStyle: 0 })
			: await ImagePicker.launchImageLibraryAsync({ presentationStyle: 0 });
		if (!_f?.cancelled) {
			setVisible(false);
			let split = _f?.uri?.split('/');
			let name = split?.[split?.length - 1];
			_f = {
				type: _f?.cancelled ? 'cancel' : '',
				name,
				mimeType: `${_f?.type}/${name?.split('.')?.[1]}`,
				uri: _f?.uri,
			};
			_onUpload(_f);
		}
	};

	const _onUploadFile = async () => {
		let _f = await DocumentPicker.getDocumentAsync({
			type:'*/*',
			copyToCacheDirectory: false,
		});
		if (_f.type !== 'cancel') {
			setVisible(false);
			_onUpload(_f);
		}
	};

	const _onPreview = (filepath: string) => {
		filepath = filepath?.replace('file://', '');
		const path = FileViewer.open(filepath)
			.then(() => {})
			.catch((error) => {});
	};

	const renderSelection = () => {
		let selection = [
			/** temporarily remove */
			// {
			//   label: 'Take a photo',
			//   icon: () => <Camera size={20} style={styles?.selectionIcon} />,
			//   onPress: _onTakePhoto,
			// },
			{
				label: 'Upload a photo',
				icon: () => <Upload size={20} style={styles?.selectionIcon} />,
				onPress: _onUploadPhoto,
			},
			{
				label: 'Cancel',
				onPress: () => setVisible(false),
			}
		];
		if (!photoOnly) {
			selection.splice(1, 0, {
				label: 'Upload a file',
				icon: () => <FileAdd size={20} style={styles?.selectionIcon} />,
				onPress: _onUploadFile,
			});
		}
		let renderItem = ({item}: any) => {
			return (
				<TouchableOpacity onPress={item?.onPress}>
					<View style={styles.selectionRow}>
						{item?.icon && item?.icon()}
						<Text style={styles?.selectionText}>{item?.label}</Text>
					</View>
				</TouchableOpacity>
			)
		};
		return (
			<AnimatedModal
				visible={visible}
				onDismiss={() => setVisible(false)}
			>
				<FlatList
					data={selection}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${index}`}
					ItemSeparatorComponent={() => <View style={styles?.selectionSeparator} />}
				/>
			</AnimatedModal>
		)
	};

	const renderItem = (_file: any, _index: number) => {
		if (multipleFiles) {
			uploading = _file?.uploading;
			uploaded = _file?.uploaded;
		}
		const truncate = (source, size) => { return source?.length > size ? source?.slice(0, size - 1) + '…' : source; }
		const preview = NTCPreview(_file?.name);
		return (
			<>
				{
					!!_file?.name &&
					<View style={styles.fileContainer}>
						<View style={!!_file?.name && uploaded && styles?.fileTextContainer50}>
							<Text style={styles.fileText} numberOfLines={1}>
								{Platform.select({
									web: truncate(_file?.name, 15),
									native: _file?.name
								})}
							</Text>
							{
								uploaded && !uploading &&
								<Text style={styles.uploadedText}>Uploaded</Text>
							}
						</View>
							<View>
									{
										!!_file?.name && uploaded
											? <TouchableOpacity
													onPress={() => {
														if (isMobile) _onPreview(_file?.uri);
														else _onWebPreview(_file);
													}}
													disabled={disabled}
												>
													<ImageBackground
														style={styles?.filePreview}
														source={preview === 'image' ? {uri: _file?.uri} : preview}
													>
														<TouchableOpacity
															onPress={() => {
																if (multipleFiles) {
																	let _files = [...files];
																	_files.splice(_index, 1);
																	setFiles(_files);
																}
																else setFile({});
																onRemove(_index);
															}}
															disabled={disabled}
														>
															<View style={styles?.xPreviewContainer}>
																<Close size={20} color='#fff' />
															</View>
														</TouchableOpacity>
													</ImageBackground>
												</TouchableOpacity>
											: <TouchableOpacity
													style={styles.fileXContainer}
													onPress={() => {
														if (multipleFiles) {
															let _files = [...files];
															_files.splice(_index, 1);
															setFiles(_files);
														}
														else setFile({});
														onRemove(_index);
													}}
													disabled={disabled}
												>
													<Close
														color={disabled ? disabledColor : defaultColor}
														size={15}
													/>
												</TouchableOpacity>
									}
							</View>
					</View>
				}
				{
					uploading &&
					<ProgressBar
						color={infoColor}
						height={4}
						style={styles.progressBar}
					/>
				}
			</>
		)
	};

	const _onWebPreview = (_file: any) => {
		const preview = NTCPreview(_file?.name);
		setModalFile({preview, uri: _file?.uri})
		setModalVisible(true)
	}

	return (
		<View style={!raw && styles.container}>
			<Button
				style={[styles.uploadContainer, raw && {backgroundColor: undefined}]}
				onPress={() => {
					if (isMobile) setVisible(true)
					else _onUploadFile();
				}}
				disabled={disabled}
			>
				<Upload
					color={disabled ? disabledColor : raw ? infoColor : defaultColor}
					size={15}
				/>
				<Text style={[styles.uploadText, disabled && styles.disabledText]}>
					{uploadText}
				</Text>
			</Button>
			{!raw && renderItem(file, -1)}
			{
				!raw &&
				multipleFiles &&
				<FlatList
					horizontal={Platform.select({web: true, native: false})}
					data={defaultFiles}
					renderItem={({item, index}) => renderItem(item, index)}
					keyExtractor={(item, index) => `${index}`}
					ItemSeparatorComponent={() => <View style={styles?.separator} />}
				/>
			}
			{renderSelection()}
			<Modal
				transparent={true}
				visible={modalVisible}
				onRequestClose={()=> setModalVisible(false)}
			>
				<View style={{flex:1, alignItems:'flex-end'}}>
					<TouchableWithoutFeedback onPressOut={() => setModalVisible(false)}>
						<View style={[{
							width:serviceLayout?.width,
							height:'100%',
							alignItems:'center',
							justifyContent:'center',
							position:'absolute',
							backgroundColor:'rgba(0, 0, 0, 0.5)'
						}]}/>
					</TouchableWithoutFeedback>
					<View style={[{width:serviceLayout?.width}]}>
						<View style={{alignSelf:'flex-end', zIndex:1, paddingHorizontal:15, paddingVertical:15}}>
							<TouchableOpacity onPress={() => setModalVisible(false)}>
								<Text style={{color:'#fff'}}>Close</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{width:serviceLayout?.width, flex:1, justifyContent:'center', alignItems:'center'}}>
						{
							modalFile?.preview==='image'
								? <Image
										style={[{
											width:serviceLayout?.width*0.8,
											height:serviceLayout?.height*0.8
										}]}
										resizeMode={'contain'}
										source={modalFile?.preview==='image' ? {uri: modalFile?.uri} : modalFile?.preview}
									/>
								: <View>
										<object
											style={{
												zIndex:2,width:serviceLayout?.width,
												height:serviceLayout?.height
											}}
											data={modalFile?.uri}
										>
											<Text>Could not load Doc. Make sure the source is correct and the browser is not on device mode.</Text>
										</object>
									</View>
						}
					</View>
				</View>
			</Modal>
		</View>
	)
};

export default UploadFile;


