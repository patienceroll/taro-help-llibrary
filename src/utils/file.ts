import Taro from '@tarojs/taro';

export function saveBase64ToAblum(options: { base64: string; name: string }) {
  const filePath = Taro.env.USER_DATA_PATH + '/' + options.name;
  console.log(filePath);
  return new Promise((resolve, reject) => {
    Taro.getFileSystemManager().writeFile({
      filePath,
      encoding: 'base64',
      data: options.base64.replace('data:image/png;base64,', '').replace(/[\r\n]/g, ''),
      success: resolve,
      fail: reject,
    });
  })
    .then(() => Taro.getSetting())
    .then((res) => {
      if (res.authSetting['scope.writePhotosAlbum']) return Promise.resolve();
      return Taro.authorize({ scope: 'scope.writePhotosAlbum' }).then(() => Promise.resolve());
    })
    .then(() => Taro.saveImageToPhotosAlbum({ filePath }));
}
