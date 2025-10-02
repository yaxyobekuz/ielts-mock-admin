import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const useDebouncedState = (initialValue, setLoader, delay = 1000) => {
  const [value, setValue] = useState(initialValue);

  const debouncedSetValue = useCallback(
    debounce((v) => {
      setValue(v);
      setLoader(false, v);
    }, delay),
    []
  );

  const updateValue = (v) => {
    setLoader?.(true);
    debouncedSetValue(v);
  };

  useEffect(() => {
    return () => {
      debouncedSetValue.cancel();
    };
  }, [debouncedSetValue]);

  return [value, updateValue];
};

export default useDebouncedState;
