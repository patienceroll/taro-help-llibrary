import { View, Image } from '@tarojs/components';
import React, { memo } from 'react';
import Taro from '@tarojs/taro';

import Back from './back.svg';
import BackWhite from './back.white.svg';
import Home from './home.svg';
import HomeWhite from './home.white.svg';

import './index.less';

export default memo(function HicooCustomNavBar(props: {
  children: React.ReactNode;
  backIcon?: string;
  homeIcon?: string;
  /** 默认 black */
  theme?: 'black' | 'white';
}) {
  const { children, backIcon, homeIcon, theme = 'black' } = props;
  const systemInfo = Taro.getSystemInfoSync();
  const { top, height: menuHeigt } = Taro.getMenuButtonBoundingClientRect();
  const pages = Taro.getCurrentPages();
  const { statusBarHeight = 0 } = systemInfo;

  const margin = top - statusBarHeight;
  const height = statusBarHeight + margin * 2 + menuHeigt;

  return (
    <View className="hicoo-custom-nav-bar-ct" style={{ paddingTop: height - menuHeigt - margin }}>
      <View className="hicoo-custom-nav-bar-back-wrap">
        <Image
          src={
            pages.length > 1
              ? backIcon || { black: Back, white: BackWhite }[theme]
              : homeIcon || { black: Home, white: HomeWhite }[theme]
          }
          onClick={() => {
            if (pages.length === 1) Taro.switchTab({ url: '/pages/index/index' });
            else Taro.navigateBack();
          }}
        />
      </View>
      <View
        className="hicoo-custom-nav-bar-title"
        style={{ lineHeight: `${menuHeigt}px`, color: { black: '#000', white: '#fff' }[theme] }}
      >
        {children}
      </View>
      <View className="hicoo-custom-nav-bar-placeholder" />
    </View>
  );
});
