import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const saveData = (item: string, data: unknown) => {
  getDeviceStorage()?.setItem(item, JSON.stringify(data));
};

export const getData = <T>(item: string): T | undefined => {
    return getDeviceStorage()?.getItem(item) as T
}

export const getDeviceStorage = () => {
  if (Platform.OS == "web") {
    if (typeof window == "undefined") return undefined
        
    return window.localStorage
  };

  return AsyncStorage;
};
