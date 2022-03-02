import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import {
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import lodash from 'lodash';
import { useStateCallback } from 'src/hooks/useStateCallback';

import Tag from './tag';
import Input from './Input';
import styles from './styles';

interface Props {
  initialText?: string;
  initialTags?: Array<object>;
  createTagOnString?: Array<any>;
  createTagOnReturn?: boolean;
  readonly?: boolean;
  deleteTagOnPress?: boolean;
  maxNumberOfTags?: number;
  renderTag?: Function;
  onChangeTags?: Function;
  onChangeTextDebounce?: Function;
  debounceTime?: number;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  tagContainerStyle?: StyleProp<ViewStyle>;
  tagTextStyle?: StyleProp<TextStyle>;
  [x: string]: any;
}

export type TextInputRef =  {
  blur: any,
  focus: any,
}

const InputTags: ForwardRefRenderFunction<TextInputRef, Props> = ({
  initialTags = [],
  initialText = "",
  createTagOnString = [",", " "],
  createTagOnReturn = false,
  readonly = false,
  deleteTagOnPress = true,
  maxNumberOfTags = Number.POSITIVE_INFINITY,
  renderTag = ({ tag, index, ...rest }:any) => (
    <Tag key={`${tag?._id}-${index}`} label={tag?.firstName} {...rest} />
  ),
  onChangeTags,
  onTagPress,
  onChangeTextDebounce = () => {},
  debounceTime = 500,
  containerStyle,
  tagContainerStyle,
  tagTextStyle,
  style,
  ...otherProps
}, ref) => {
  const inputRef:any = useRef(null);
  const [state, setState] = useStateCallback({
    tags: initialTags,
    text: initialText,
  });

  const showLastTag = () => {
    setState((current:any) =>
      ({
        tags: current.tags.slice(0, -1),
        text: current.tags.slice(-1)[0]?.firstName || ""
      }),
      (current:any) => {
        if (onChangeTags) onChangeTags(current.tags);
        changeValueDebouncer(state?.tags?.slice(-1)[0]?.firstName || "");
      }
    );
  };

  const addTag = (item:object) => {
    setState((current:any) =>
      ({
        tags: [...current.tags, item],
        text: ""
      }),
      (current:any) => {
        if (onChangeTags) onChangeTags(current.tags);
        changeValueDebouncer("");
      }
    );
  };

  const onChangeText = (text:string) => {
    if (text.length === 0) {
      showLastTag();
    } else {
      setState((current:any) =>({ ...current, text }));
    }
  };

  const onChangeTextFn = (text:string) => {
    onChangeText(text);
    changeValueDebouncer(text);
  }

  const onKeyPress = ({ nativeEvent: { key } }:any) => {
    if(state?.text?.length === 0 && key === 'Backspace') {
      onChangeTextFn('');
    }
  }
  
  const changeTextDebounced = (text:string) => onChangeTextDebounce(text);
  const changeValueDebouncer = useCallback(lodash.debounce(changeTextDebounced, debounceTime), []);

  useImperativeHandle(ref, () => ({
    blur: () => inputRef.current.blur(),
    focus: () => inputRef.current.focus(),
    addTag: (item:object) => addTag(item)
  }));

  return (
    <View style={[styles.container, containerStyle, style]}>
      {state.tags.map((tag:Array<string>, index:number) => {
        const tagProps = {
          tag,
          index,
          deleteTagOnPress,
          onPress: (event:any) => {
            event?.persist();
            if (deleteTagOnPress && !readonly) {
              setState((current:any) =>
                ({
                  tags: [
                    ...current.tags.slice(0, index),
                    ...current.tags.slice(index + 1)
                  ]
                }),
                (current:any) => {
                  onChangeTags &&
                    onChangeTags(current.tags);
                  onTagPress && onTagPress(index, tag, event, true);
                }
              );
            } else {
              onTagPress && onTagPress(index, tag, event, false);
            }
          },
          tagContainerStyle,
          tagTextStyle
        };

        return renderTag(tagProps);
      })}

      {!readonly
        && maxNumberOfTags > state.tags.length
        &&
        <Input
          ref={inputRef}
          value={state.text}
          onChangeText={onChangeTextFn}
          onKeyPress={onKeyPress}
          {...otherProps}
        />
      }
    </View>
  );
};

export default forwardRef(InputTags);