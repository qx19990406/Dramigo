import DeviceInfo from 'react-native-device-info';

// 是否需要版本升级
export function isNeedUpdate(storeVersion) {
  if (
    storeVersion === null ||
    storeVersion === undefined ||
    storeVersion.length === 0
  ) {
    return false;
  }
  const localParts = DeviceInfo.getVersion().split('.').map(Number);
  const storeParts = storeVersion.split('.').map(Number);
  let needUpdate = false;
  for (let i = 0; i < 3; i++) {
    if (storeParts[i] > localParts[i]) {
      needUpdate = true;
      break;
    } else if (storeParts[i] < localParts[i]) {
      break;
    }
  }
  return needUpdate;
}

// json转对象
export function jsonStringParse(jsonString = '') {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return [];
  }
}

// 随机导出页码数， 用于详情页推荐列表
export function exportRandomPage(total = 0, pageSize) {
  const maxPage = Math.ceil(total / pageSize); // 计算最大页数
  if (maxPage <= 2 && maxPage > 1) {
    return maxPage - 1;
  } else if (maxPage <= 1) {
    return maxPage;
  } else {
    return Math.floor(Math.random() * (maxPage - 1)) + 1;
  }
}

// 在线图片和视频资源检测
export async function checkSource(url) {
  try {
    const response = await fetch(url, {method: 'HEAD'});
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

