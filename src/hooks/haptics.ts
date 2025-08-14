import { useCallback } from "react";

export const useHaptics = (enabled: boolean) => {
  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!enabled) return;
      if (typeof navigator !== "undefined" && (navigator as any).vibrate) {
        (navigator as any).vibrate(pattern);
      }
    },
    [enabled]
  );
  return {
    light: () => vibrate(15),
    success: () => vibrate([20, 30, 20]),
    warning: () => vibrate([10, 10, 10, 10]),
  };
};
