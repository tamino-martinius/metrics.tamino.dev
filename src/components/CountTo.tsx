import { useEffect, useRef, useState } from 'react';

const raf = window.requestAnimationFrame;
const caf = window.cancelAnimationFrame;

interface CountToProps {
  startVal?: number;
  endVal?: number;
  duration?: number;
  autoplay?: boolean;
  decimals?: number;
  decimal?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
  useEasing?: boolean;
}

function easing(t: number, b: number, c: number, d: number) {
  return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
}

function formatNumber(
  value: number,
  decimals: number,
  decimal: string,
  separator: string,
  prefix: string,
  suffix: string,
) {
  let num = value.toFixed(decimals);
  num += '';
  const x = num.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (separator && isNaN(Number(separator))) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + separator + '$2');
    }
  }
  return prefix + x1 + x2 + suffix;
}

export default function CountTo({
  startVal = 0,
  endVal = 0,
  duration = 3000,
  autoplay = true,
  decimals = 0,
  decimal = '.',
  separator = ',',
  prefix = '',
  suffix = '',
  useEasing: useEasingProp = true,
}: CountToProps) {
  const [displayValue, setDisplayValue] = useState(
    formatNumber(startVal, decimals, decimal, separator, prefix, suffix),
  );

  const rAFRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const localStartValRef = useRef(startVal);
  const localDurationRef = useRef(duration);

  const countDown = startVal > endVal;

  useEffect(() => {
    function count(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;

      let printVal: number;
      if (useEasingProp) {
        if (countDown) {
          printVal = localStartValRef.current - easing(
            progress, 0, localStartValRef.current - endVal, localDurationRef.current,
          );
        } else {
          printVal = easing(
            progress, localStartValRef.current, endVal - localStartValRef.current, localDurationRef.current,
          );
        }
      } else {
        if (countDown) {
          printVal = localStartValRef.current - (
            (localStartValRef.current - endVal) * (progress / localDurationRef.current)
          );
        } else {
          printVal = localStartValRef.current +
            (endVal - localStartValRef.current) * (progress / localDurationRef.current);
        }
      }

      if (countDown) {
        printVal = printVal < endVal ? endVal : printVal;
      } else {
        printVal = printVal > endVal ? endVal : printVal;
      }

      setDisplayValue(formatNumber(printVal, decimals, decimal, separator, prefix, suffix));

      if (progress < localDurationRef.current) {
        rAFRef.current = raf(count);
      }
    }

    if (autoplay) {
      localStartValRef.current = startVal;
      startTimeRef.current = undefined;
      localDurationRef.current = duration;
      rAFRef.current = raf(count);
    }

    return () => {
      if (rAFRef.current) caf(rAFRef.current);
    };
  }, [startVal, endVal, duration, autoplay, decimals, decimal, separator, prefix, suffix, useEasingProp, countDown]);

  return (
    <div className="count-to">
      {displayValue}
    </div>
  );
}
