import type { TextProps } from '@tarojs/components';

import { Text } from '@tarojs/components';
import React from 'react';

import './index.less';

export default function HicooTextSkeleton(
  props: Omit<TextProps, 'children'> & {
    children: undefined | string | number | null;
  },
) {
  const { children, className = '', style } = props;
  return (
    <Text
      {...props}
      style={style}
      className={`${
        typeof children === 'string' || typeof children === 'number'
          ? 'hicoo-text-skeleton'
          : 'hicoo-text-skeleton-waving'
      } ${className}`}
    >
      {children}
    </Text>
  );
}
