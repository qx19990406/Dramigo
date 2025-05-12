import {useCallback, useEffect, useRef, useState} from 'react';

export default function useCountDown(totalCount = 61) {
  const timerRef = useRef(null);
  const [countDown, setCountDown] = useState(totalCount);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    let count = totalCount - 1;
    setCountDown(count);

    timerRef.current = setInterval(() => {
      count -= 1;

      if (count === 0) {
        setCountDown(totalCount);
        if (timerRef.current !== 0) {
          clearInterval(timerRef.current);
        }
      } else {
        setCountDown(count);
      }
    }, 1000);
  }, [totalCount]);

  return {countDown, totalCount, startTimer};
}
