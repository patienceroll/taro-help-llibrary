import type { NodesRef } from '@tarojs/taro';
import Taro from '@tarojs/taro';

type Store = {
  boundingClientRect: NodesRef.BoundingClientRectCallbackResult;
  context: NodesRef.ContextCallbackResult;
  fields: TaroGeneral.IAnyObject;
  node: NodesRef.NodeCallbackResult;
  scrollOffset: NodesRef.ScrollOffsetCallbackResult;
};

export default {
  getDOM(selecters: { selecter: string; type: keyof Store }[]) {
    return new Promise<Store[keyof Store][]>((resolve, reject) => {
      const result: Store[keyof Store][] = [];
      if (!Array.isArray(selecters)) throw new Error('参数必须是数组');
      if (selecters.length === 0) resolve([]);
      try {
        selecters.forEach((i, index) => {
          function recursive() {
            setTimeout(() => {
              const item = Taro.createSelectorQuery().select(i.selecter);
              item[i.type]((res) => {
                if (Object.is(null, res)) recursive();
                else {
                  result[index] = res;
                  if (result.filter(Boolean).length === selecters.length) resolve(result);
                }
              }).exec();
            }, 16);
          }
          recursive();
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};
