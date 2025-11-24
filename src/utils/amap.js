// 高德地图配置
export const AMAP_KEY = "6d11fb451afa68687e7084f6654381f2"; // 请在此处替换为您的高德地图Key (类型必须为：Web端 JS API)
export const AMAP_SECURITY_CODE = "54621db82341a3f32e6ed81e6ade3eaa"; // 如果您的Key是在2021年12月02日之后申请的，请在此处填写安全密钥

/**
 * 动态加载高德地图API
 */
export function loadAMap() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      return;
    }

    // 设置安全密钥
    if (AMAP_SECURITY_CODE) {
      window._AMapSecurityConfig = {
        securityJsCode: AMAP_SECURITY_CODE,
      };
    }

    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.PlaceSearch,AMap.Geocoder`;
    script.onerror = (e) => {
      reject(e);
    };
    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error("高德地图加载失败"));
      }
    };
    document.head.appendChild(script);
  });
}
