import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const DataTable = () => {
  const [dataTable, setDataTable] = useState({
    keys: null,
    values: null,
  });

  useEffect(() => {
    const getData = () => {
      try {
        AsyncStorage.getAllKeys((err, keys) => {
          AsyncStorage.multiGet(keys, (err, stores) => {
            stores.map((result, i, store) => {
              // get at each store's key/value so you can work with it
              let key = store[i][0];
              let value = store[i][1];
              console.log(key, value, i);
              setDataTable({
                key: key,
                value: JSON.parse(value),
              });
            });
          });
        });
      } catch (e) {
        console.log("error:", e);
      }
    };
    //console.log(dataTable.keys);
    if (dataTable.keys) {
    }
  }),
    [];

  const useEffectOnlyOnce = (dataTable) => useEffect(getData(), []);

  return { ...DataTable, dataTable };
};
