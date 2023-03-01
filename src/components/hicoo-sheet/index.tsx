import type { ReactElement } from 'react';

import React, { memo, useRef, forwardRef, useState, useImperativeHandle } from 'react';
import { View, Image } from '@tarojs/components';

import Close from './close.png';

import './index.less';

export type HicooSheetRef = {
  show: (options: { children: ReactElement }) => void;
  close: VoidFunction;
};

export type HicooSheetProps = {
  showCloseIocn?: boolean;
  maskCloserable?: boolean;
  onClose?: VoidFunction;
};


export default memo(
  forwardRef<HicooSheetRef, HicooSheetProps>(function HicooSheet(props, ref) {
    const { showCloseIocn = false, maskCloserable, onClose } = props;
    const childrenRef = useRef<ReactElement>(<View>123123</View>);
    const [visible, setVisible] = useState(false);
    const [showed, setShowed] = useState(false);

    function closeModal() {
      onClose?.();
      setShowed(false);
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }

    useImperativeHandle(ref, () => ({
      show({ children }) {
        childrenRef.current = children;
        setVisible(true);
        setTimeout(() => {
          setShowed(true);
        }, 100);
      },
      close: closeModal,
    }));
    return visible ? (
      <View
        style={{ height: '100%', width: '100%' }}
        className={`hicoo-sheet-mask ${showed ? 'hicoo-sheet-mark_showed' : ''}`}
        onClick={maskCloserable ? closeModal : undefined}
      >
        <View className={`hicoo-sheet-context ${showed ? 'hicoo-sheet-context_showed' : ''}`}>
          {childrenRef.current}
          {showCloseIocn && <Image className="hicoo-sheet-icon" src={Close} onClick={closeModal} />}
        </View>
      </View>
    ) : null;
  }),
);
