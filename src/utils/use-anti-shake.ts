/**
 * ## 防抖
 * 返回一个与传入函数相同且防抖的函数。
 * 1. 传入的函数必须是 promise。
 * 2. 默认防抖间隔是300ms
 */
export default function useAntiShake<
  Params extends unknown[],
  ReturnType = unknown
>(
  method: (...params: Params) => Promise<ReturnType>,
  options = { delay: 300 }
) {
  let Timer: NodeJS.Timeout;

  let count = 0;
  return (...arg: Params) =>
    new Promise<ReturnType>((resolve, reject) => {
      if (Timer) clearTimeout(Timer);
      if (count === Number.MAX_SAFE_INTEGER) count = 0;
      else count++;
      const countCloser = count;
      Timer = setTimeout(() => {
        method(...arg)
          .then((res) => {
            if (count === countCloser) resolve(res);
            else reject(res);
          })
          .catch((err) => {
            reject(err);
          });
      }, options.delay);
    });
}
