# browser-cookie-login

一个打开浏览器并登录获取cookie的小工具，一般用户命令行登录后自动化使用。

有时候我们需要使用程序去调用服务器的一些接口，但是有一部分接口是需要用户登录的信息，用户登录有好多种实现方式，其中cookie就是其中一种。

登录主要流程就是用户通过打开网页登录后，服务器下发cookie，后续的接口访问我们直接在请求上携带cookie便可知道登录的用户，也可以调用对应权限的接口。

该工具就实现了，命令行打开浏览器登录并获取的cookie的操作。

## 安装

```bash
npm install browser-cookie-login --save
# 或者使用yarn
yarn add browser-cookie-login
```

## 使用

```ts
import { getCookieValue } from "browser-cookie-login";

getCookieValue({
  cookieName: "user_session",
  url: "https://github.com/",
  resolveResult: async (browser) => {
    const url = await browser.getUrl();
    return new URL(url).host === 'github.com';
  }
}).then(resp => {
  console.log("cookie：", resp);
}).catch(error => {
  console.log(error);
});
```

## 参数说明

getCookieValue方法参数说明：

```ts
export interface IOptions {
  /**
   * 要获取的cookie名称
   */
  cookieName: string;
  /**
   * 要打开的浏览器地址
   */
  url: string;
  /**
   * 重试获取cookie时间间隔，默认为1，单位秒
   */
  retryInterval?: number;
  /**
   * 登录成功展示文案，可以是一个html字符串，默认：你已经登录成功，浏览器即将关闭！
   */
  successMessage?: string;
  /**
   * 登录成功页面展示时长，默认为3s，单位秒
   */
  successShowDuration?: number;
  /**
   * 浏览器配置，查看webdriverio文档
   */
  capabilities?: RemoteCapability;
  /**
   * 处理响应的结果，获取到cookie后，在通过这个参数判断后返回true才算成功
   * 因为有些跳转后会重定向到登录页面，登录域名下面有同名cookie会导致返回错误的cookie
   * @param browser
   */
  resolveResult?: (browser: Browser<any>) => Promise<boolean>;
}
```

## 开发

```bash
# 安装依赖
npm install
# 启动调试
npm start
# 打包
npm run build
```

## 已知问题

- 用户手动关闭了浏览器会报错。
