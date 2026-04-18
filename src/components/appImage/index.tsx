import React, { FC, memo } from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { StyleSheet } from 'react-native';

interface Props extends Omit<FastImageProps, 'source'> {
  uri: string;
  size?: number;
}

const AppImage: FC<Props> = ({ uri, size = 32, style, ...props }) => {
  const imageStyle = size ? { width: size, height: size } : {};

  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.web,
      }}
      style={StyleSheet.flatten([imageStyle, style])}
      {...props}
    />
  );
};

export default memo(AppImage);
