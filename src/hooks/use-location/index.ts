/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Taro from "@tarojs/taro";

import useAntiShake from "../../utils/use-anti-shake";

/** ### 地址逆解析数据
 * @see https://lbs.amap.com/api/webservice/guide/api/georegeo
 */
export type LocationReverseData = {
  /** 返回值为 0 或 1，0 表示请求失败；1 表示请求成功。 */
  status: 0 | 1;
  /** 逆地理编码列表 */
  regeocode: {
    addressComponent: {
      /** 坐标点所在省名称 */
      province: string;
      /** citycode 重庆市:023 */
      citycode: string;
    };
    formatted_address: string;
  };
};

export type LocationStatus = "成功" | "用户拒绝" | "未定位" | "失败";

export type LocationData = Taro.getLocation.SuccessCallbackResult & {
  timeStamp: number;
  /** citycode 重庆市:023 */
  city: string;
  province: string;
  locationReverseData: LocationReverseData;
};

/** 后端的地址你解析接口 */
function postLocationReverse(params: any) {
  return Promise.resolve({} as { data: LocationReverseData });
}

function getLoaclStorageLocation(): LocationData | undefined {
  const value = Taro.getStorageSync("location");
  return value ? JSON.parse(value) : undefined;
}

const getTaroLocation = useAntiShake(Taro.getLocation, { delay: 100 });

export default function useLocation() {
  const [location, setLocation] = React.useState(getLoaclStorageLocation);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<LocationStatus>(() =>
    location ? "成功" : "未定位"
  );
  const getLocation = React.useCallback(() => {
    setLoading(true);
    return getTaroLocation({ isHighAccuracy: true })
      .then((res) => {
        // res.latitude = 29.556429;
        // res.longitude = 106.57384;
        const { latitude, longitude } = res;
        return postLocationReverse({
          location: { lat: String(latitude), lng: String(longitude) },
        }).then(({ data: locationData }) => {
          if (!locationData || locationData.status === 0)
            return Promise.reject();
          const data: LocationData = {
            ...res,
            timeStamp: +new Date(),
            locationReverseData: locationData,
            city: locationData.regeocode.addressComponent.citycode,
            province: locationData.regeocode.addressComponent.province,
          };
          setLocation(data);
          Taro.setStorage({
            key: "location",
            data: JSON.stringify(data),
          });
          setStatus("成功");
          setLoading(false);
          return data;
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err.errMsg === "getLocation:fail auth deny") setStatus("用户拒绝");
        else {
          setStatus("失败");
          Taro.showToast({ title: "定位失败", icon: "error" });
        }
        console.log(err);
        return Promise.reject();
      });
  }, []);

  Taro.useLoad(() => {
    if (!location || +new Date() - location.timeStamp > 1000 * 60 * 5) {
      console.log("调用了一次getLocation");
      getLocation();
    }
  });

  return {
    location,
    loading,
    status,
    reFresh: getLocation,
  };
}
