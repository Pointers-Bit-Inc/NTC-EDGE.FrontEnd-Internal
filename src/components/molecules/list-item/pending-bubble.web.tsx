import React,{FC,useEffect,useState} from 'react'
import {Dimensions,Image,Platform,StyleSheet,TouchableOpacity,View} from 'react-native'
import Text from '@components/atoms/text'
import {NewFileIcon} from '@components/atoms/icon'
import {bubble,outline} from '@styles/color'
import {fontValue} from '@components/pages/activities/fontValue';
import {getFileSize} from '@/src/utils/formatting';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubbleContainer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    borderRadius: fontValue(6),
    padding: fontValue(5),
    paddingHorizontal: fontValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })
  },
  seenContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  seenTimeContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  flipX: {
    transform: [
      {
        scaleX: -1
      }
    ]
  },
  check: {
    borderRadius: fontValue(12),
    width: fontValue(12),
    height: fontValue(12),
    borderColor: outline.error,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    paddingTop: 0.5,
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })
  },
  progress: {
    marginLeft: 2,
    paddingLeft: 0,
    paddingTop: 0,
  },
  file: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  imageFile: {
    marginRight: 2,
    width: 250,
    height: 250,
  }
})

interface Props {
  message?: string;
  messageId?: string;
  messageType?: string;
  channelId?: string;
  groupName?: string;
  participants?: any;
  error?: boolean;
  maxWidth?: any;
  style?: any;
  createdAt?: any;
  onLongPress?: any;
  onSendMessage?: any;
  onSendFile?: any;
  onPreview?: any;
  [x: string]: any;
}

const PendingBubble:FC<Props> = ({
  message = '',
  messageId = '',
  messageType = 'text',
  channelId = '',
  groupName = '',
  participants = [],
  attachment = {},
  error = false,
  maxWidth = '60%',
  style,
  createdAt,
  onLongPress,
  onSendMessage = () => {},
  onSendFile = () => {},
  onPreview = () => {},
  ...otherProps
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(async()=>{
    const formData=new FormData();
    const controller=new AbortController();
    const config={
      signal:controller.signal,
      onUploadProgress({loaded,total}:any){
        const percentComplete=loaded/total;
        setProgress(percentComplete);
      },
    };
    if(messageType==='file'){
      let file:any={
        name:attachment?.name,
        type:attachment?.mimeType,
        uri:attachment?.uri,
      };
      
      if (Platform.OS === 'web') {
        await fetch(attachment?.uri).then(res=>{
          return res?.blob()
        }).then(blob=>{
          const fd=new FormData();

          var mime = attachment?.uri.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
          var attachmentMime = mime[1]?.split("/")?.[1]
          if (mime && mime.length) {
            file=new File([blob],attachment?.name +  (attachmentMime.length < 5 ? "." + attachmentMime: '') );
          }
        })
      }

      formData.append('file',file);
    }

    formData.append('message',message);

    if(!channelId){
      formData.append('name',groupName);
      formData.append('participants',JSON.stringify(participants));
    } else{
      formData.append('roomId',channelId);
    }

    onSendMessage(formData,messageId,config,!channelId);

    return ()=>{
      controller.abort();
    }
  }, [messageId]);

  return (
    <TouchableOpacity
      onPress={onPreview}
      onLongPress={onLongPress}
      {...otherProps}
    >
      <View style={[styles.container, { maxWidth }, style]}>
        <View style={styles.bubbleContainer}>
          {
            attachment?.mimeType === 'application/octet-stream' ? (
              <Image
                resizeMode={'cover'}
                style={styles.imageFile}
                borderRadius={10}
                source={{ uri: attachment.uri }}
              />
            ) : (
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: '#E3E5EF'
                  },
                ]}
              >
                {
                  messageType === 'file' ? (
                    <View style={styles.file}>
                      <NewFileIcon
                        color={'#606A80'}
                      />
                      <View style={{ paddingHorizontal: 5, maxWidth: width * 0.3 }}>
                        <Text
                          size={12}
                          color={'#606A80'}
                        >
                          {attachment.name}
                        </Text>
                        <Text
                          size={10}
                          color={'#606A80'}
                          style={{ top: -2 }}
                        >
                          {getFileSize(attachment.size)}
                        </Text>
                      </View>
                      <View style={{ width: 10 }} />
                    </View>
                  ) : (
                    <Text
                      size={14}
                      color={'black'}
                    >
                      {message}
                    </Text>
                  )
                }
              </View>
            )
          }
        </View>
        {
          error ? (
            <View
              style={[styles.check]}
            />
          ) : (
            <Progress.Circle
              style={styles.progress}
              size={fontValue(12)}
              progress={progress}
              thickness={1.5}
              borderWidth={0}
              color={outline.info}
              unfilledColor={outline.default}
            />
          )
        }
      </View>
    </TouchableOpacity>
  )
}

export default PendingBubble
