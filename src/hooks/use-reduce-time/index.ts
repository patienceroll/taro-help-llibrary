import { useCallback, useEffect, useRef, useState } from 'react';
import timeUtil from '../../utils/time';

export default function useReduceTime(
  defaultEnd?: Date,
  options: {
    onEnd?: VoidFunction;
  } = {},
) {
  const { onEnd } = options;
  const id = useRef<number>();
  const endTime = useRef(defaultEnd || new Date());
  const [time, setTime] = useState<{ hour: number; minute: number; seconds: number; day: number }>({
    hour: 0,
    day: 0,
    minute: 0,
    seconds: 0,
  });
  const [timeCarry, setTimeCarry] = useState<{
    hour: string;
    minute: string;
    seconds: string;
    day: string;
  }>({
    day: '0',
    hour: '00',
    minute: '00',
    seconds: '00',
  });

  const doFunc = useCallback(function (current: Date) {
    const { aDayStamp, aHourStamp, aMinuteStamp, aSecondsStamp, carray } = timeUtil;
    const timeStamp = +endTime.current - +current;
    const day = Math.floor(timeStamp / aDayStamp);
    const dayReduce = timeStamp % aDayStamp;
    const hour = Math.floor(dayReduce / aHourStamp);
    const hourReduce = dayReduce % aHourStamp;
    const minute = Math.floor(hourReduce / aMinuteStamp);
    const minuteReduce = hourReduce % aMinuteStamp;
    const seconds = Math.floor(minuteReduce / aSecondsStamp);
    setTime({ day, hour, minute, seconds });
    setTimeCarry({
      day: String(day),
      hour: carray(hour),
      minute: carray(minute),
      seconds: carray(seconds),
    });
  }, []);

  const start = useCallback(() => {
    if (id.current) cancelAnimationFrame(id.current);
    const fun = function () {
      const current = new Date();
      if (+current > +endTime.current) {
        onEnd?.();
        if (id.current) cancelAnimationFrame(id.current);
      } else {
        doFunc(current);
        id.current = requestAnimationFrame(() => fun());
      }
    };
    fun();
  }, [doFunc, onEnd]);

  const reStartWith = useCallback(
    (date: Date) => {
      endTime.current = date;
      start();
    },
    [start],
  );

  useEffect(() => {
    return () => {
      if (id.current) cancelAnimationFrame(id.current);
    };
  }, []);

  return {
    time,
    timeCarry,
    start,
    reStartWith,
  };
}
