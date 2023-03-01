import type { InputProps, ButtonProps, ViewProps } from '@tarojs/components';

import { View, Image, Input, Button } from '@tarojs/components';
import React, { useRef } from 'react';

import Search from './search.png';

import './index.less';

/** ### 完全继承input的props,此外添加 wrapper 和 button 传入props的字段 */
type HicooSearchInputProps = Omit<InputProps, 'ref'> & {
  ref?: React.RefObject<any>;
  buttonProps?: ButtonProps;
  /** 包裹input和button的容器props */
  wrapperProps?: Omit<ViewProps, 'children'>;
  /** 点击搜索按钮 */
  onClickSearch?: (value: string) => void;
};

export default function HicooSearchInput(props: HicooSearchInputProps) {
  const { buttonProps = {}, wrapperProps = {}, onClickSearch, ref } = props;
  const inputRef = useRef<React.LegacyRef<any>>();

  function gernerateWrapperProps(): HicooSearchInputProps['wrapperProps'] {
    const { className = '' } = wrapperProps;
    return {
      ...wrapperProps,
      className: `hicoo-search-input-wrapper ${className}`,
    };
  }

  function gernerateButtonProps(): HicooSearchInputProps['buttonProps'] {
    const { className = '', children } = buttonProps;
    return {
      ...buttonProps,
      children: children || <Image className="hicoo-search-input-button-children" src={Search} />,
      className: `hicoo-search-input-button ${className}`,
      onClick(event) {
        buttonProps?.onClick?.(event);
        onClickSearch?.((ref || inputRef).current.value);
      },
    };
  }

  function gernerateInputProps() {
    const { placeholderClass = '', className = '' } = props;
    const inputProps: HicooSearchInputProps = {
      ...props,
      className: `hicoo-search-input-input ${className}`,
      placeholderClass: `hicoo-search-input-placeholder ${placeholderClass}`,
      ref: ref || inputRef,
    };
    delete inputProps.buttonProps;
    delete inputProps.wrapperProps;
    return inputProps;
  }

  return (
    <View {...gernerateWrapperProps()}>
      <Input {...gernerateInputProps()} />
      <Button {...gernerateButtonProps()} />
    </View>
  );
}
