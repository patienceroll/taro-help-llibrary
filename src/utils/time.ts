function carray(n: number) {
  if (n < 10) return `0${n}`;
  return String(n);
}

export default {
  getCurrentTime() {
    const ob = new Date();
    return {
      date: ob,
      year: ob.getFullYear(),
      mounthCarry: carray(ob.getMonth() + 1),
      dayCarry: carray(ob.getDate()),
      hourCarry: carray(ob.getHours()),
      minuteCarry: carray(ob.getMinutes()),
      /** 如果小于10,返回 0x,如果大于等于10，返回原数字 */
      secondsCarry: carray(ob.getSeconds()),
    };
  },
  getStampTime(timeStamp: number) {
    const ob = new Date(timeStamp);
    return {
      date: ob,
      year: ob.getFullYear(),
      mounthCarry: carray(ob.getMonth() + 1),
      dayCarry: carray(ob.getDate()),
      hourCarry: carray(ob.getHours()),
      minuteCarry: carray(ob.getMinutes()),
      /** 如果小于10,返回 0x,如果大于等于10，返回原数字 */
      secondsCarry: carray(ob.getSeconds()),
    };
  },
  getDate(time: string) {
    return new Date(time.replaceAll('-', '/'));
  },
  carray,
  aDayStamp: 1000 * 60 * 60 * 24,
  aHourStamp: 1000 * 60 * 60,
  aMinuteStamp: 1000 * 60,
  aSecondsStamp: 1000,
};
