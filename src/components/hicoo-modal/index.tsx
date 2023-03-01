import type { ReactElement } from 'react';

import React, { memo, useRef, forwardRef, useState, useImperativeHandle } from 'react';
import { View, Image } from '@tarojs/components';

import Close from './close.png';

import './index.less';

export type HicooModalRef = {
  show: (options: { children: ReactElement }) => void;
  update: (options: { children: ReactElement }) => void;
  close: VoidFunction;
};

export type HicooModalProps = {
  showCloseIocn?: boolean;
  maskCloserable?: boolean;
};

export default memo(
  forwardRef<HicooModalRef, HicooModalProps>(function HicooModal(props, ref) {
    const { showCloseIocn = false, maskCloserable } = props;
    const childrenRef = useRef<ReactElement>(<View>content</View>);
    const [visible, setVisible] = useState(false);
    const [showed, setShowed] = useState(false);
    const [_, update] = useState(false);

    function closeModal() {
      setShowed(false);
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }

    useImperativeHandle(ref, () => ({
      show({ children }) {
        childrenRef.current = children;
        setVisible(true);
        requestAnimationFrame(() => {
          setShowed(true);
        });
      },
      update({ children }) {
        childrenRef.current = children;
        update((t) => !t);
      },
      close: closeModal,
    }));
    return visible ? (
      <View
        style={{ height: '100%', width: '100%' }}
        className={`hicoo-modal-mask ${showed ? 'hicoo-modal-mark_showed' : ''}`}
        onClick={maskCloserable ? closeModal : undefined}
      >
        <View className={`hicoo-modal-context ${showed ? 'hicoo-modal-context_showed' : ''}`}>
          {showCloseIocn && <Image className="hicoo-modal-icon" src={Close} onClick={closeModal} />}
          {childrenRef.current}
        </View>
      </View>
    ) : null;
  }),
);
