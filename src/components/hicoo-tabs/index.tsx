import { ScrollView, View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import type Taro from '@tarojs/taro';

import dom from '@/utils/dom';

import './index.less';

export type HicooTabProps = {
  /** tabkey 的值必须支持 Taro.createSelectorQuery().select 的参数,传入中文(或者某些特殊字符)有可能导致tab出问题,最好是传入英文或者数字  */
  tabKey: string | number;
  title: React.ReactNode;
  children?: (React.ReactElement | string | number)[];
};

type HicooTabsProps = {
  children: React.ReactElement | React.ReactElement[];
  defaultKey?: HicooTabProps['tabKey'];
  onChange?: (key: HicooTabProps['tabKey']) => void;
};

interface TabsType {
  (props: HicooTabsProps): React.ReactElement;
  Tab: typeof HicooTab;
}

const TabsContext = React.createContext<{
  keys: Map<HicooTabProps['tabKey'], HicooTabProps['tabKey']>;
  current: HicooTabProps['tabKey'];
}>({ keys: new Map(), current: null as unknown as HicooTabProps['tabKey'] });

function HicooTab(props: HicooTabProps) {
  const {
    /** 此处的children以后想控制展示内容的时候再处理 */
    children,
    title,
    tabKey,
  } = props;

  const TabsCtx = React.useContext(TabsContext);

  return (
    <View className={`hicoo-tab ${tabKey === TabsCtx.current ? 'hicoo-tab-current' : ''}`}>
      {title}
    </View>
  );
}

/** 当前组件生成次数,用于区分组件 */
let TabsID = 0;

const HicooTabs: TabsType = (props: HicooTabsProps) => {
  const { children, defaultKey, onChange } = props;

  const [tabsId] = useState(() => (TabsID += 1));
  const TabsCtx = React.useContext(TabsContext);
  TabsCtx.keys.clear();
  const renderChildren = Array.isArray(children) ? children : [children];

  const [current, setCurrent] = useState(
    defaultKey || (renderChildren[0].props.tabKey as HicooTabProps['tabKey']),
  );
  const [left, setLeft] = useState(0);

  renderChildren.forEach((child) => {
    const key = child.props.tabKey;
    TabsCtx.keys.set(key, key);
  });

  useEffect(() => {
    dom
      .getDOM([
        { type: 'scrollOffset', selecter: `#hicoo-tabs-${tabsId}` },
        { type: 'boundingClientRect', selecter: `#hicoo-tabs-bar-item-${tabsId}-${current}` },
        { type: 'boundingClientRect', selecter: `#hicoo-tabs-bar-swiper-${tabsId}` },
        { type: 'boundingClientRect', selecter: `#hicoo-tabs-${tabsId}` },
      ])
      .then((res) => {
        /** 父级滚动的参数 */
        const scroller = res[0] as Taro.NodesRef.ScrollOffsetCallbackResult;
        /** 父级的Rect */
        const scrollerRect = res[3] as Taro.NodesRef.BoundingClientRectCallbackResult;
        /** 当前选中的tab的 Rect */
        const result = res[1] as Taro.NodesRef.BoundingClientRectCallbackResult;
        /** 底部滚动条rect */
        const swiper = res[2] as Taro.NodesRef.BoundingClientRectCallbackResult;
        setLeft(
          result.left - scrollerRect.left + (result.width - swiper.width) / 2 + scroller.scrollLeft,
        );
      });
  }, [current]);

  return (
    <TabsContext.Provider value={{ keys: TabsCtx.keys, current }}>
      <ScrollView scrollX id={`hicoo-tabs-${tabsId}`} className="hicoo-tabs">
        <View className="hicoo-tabs-bar">
          {renderChildren.map((child) => {
            return (
              <View
                key={child.props.tabKey}
                id={`hicoo-tabs-bar-item-${tabsId}-${child.props.tabKey}`}
                className="hicoo-tabs-bar-item"
                onClick={() => {
                  setCurrent(child.props.tabKey as HicooTabProps['tabKey']);
                  if (current !== child.props.tabKey && onChange)
                    onChange(child.props.tabKey as HicooTabProps['tabKey']);
                }}
              >
                {child}
              </View>
            );
          })}
          <View
            id={`hicoo-tabs-bar-swiper-${tabsId}`}
            className="hicoo-tabs-bar-swiper"
            style={{ left }}
          />
        </View>
      </ScrollView>
    </TabsContext.Provider>
  );
};

HicooTabs.Tab = HicooTab;

export default HicooTabs;
