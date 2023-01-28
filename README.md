# browser-cookie-login

[中文文档](https://github.com/gslnzfq/browser-cookie-login/blob/main/README_CN.md)

A tool that opens a browser and login to obtain cookies. Generally, it is used automatically after the user login from the command line.

Sometimes we need to use programs to call some server API, but some API require user login information. There are many ways to implement user login, among which cookie is one of them.

After we login by browser, we can obtain cookies from browser. For subsequent API access, we can directly carry the cookie in the request to know the logged-in user, and we can also call the API with corresponding permissions.

This tool is realized, the command line opens the browser to login and obtain the cookie operation.

## Installation

```bash
npm install browser-cookie-login --save
# or you can use yarn
yarn add browser-cookie-login
```

## Usages

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

## Options

The options of getCookieValue function：

```ts
export interface IOptions {
  /**
   * The cookieName of login, such as "sessionid"
   */
  cookieName: string;
  /**
   * The login url of website, such as "https://github.com"
   */
  url: string;
  /**
   * The interval of check cookieName is existed, you need not change it, default 1 sencond.
   */
  retryInterval?: number;
  /**
   * Success page content, default "你已经登录成功，浏览器即将关闭！"
   */
  successMessage?: string;
  /**
   * Success page display duration, you need not change it, default 3 sencond. browser would close.
   */
  successShowDuration?: number;
  /**
   * see document of webdriverio.RemoteCapability
   */
  capabilities?: RemoteCapability;
  /**
   * The handler of result, when return true, the login process will exit and show success page.
   * if your login page and home page has different host, such as login page is "https://login.github.com" and home page is "https://github.com"
   * the cookie is stored on home page, you should resolve youself.
   * more please see examples
   * @param browser
   */
  resolveResult?: (browser: Browser<any>) => Promise<boolean>;
}
```

## Development

```bash
# install dependence
npm install
# start dev
npm start
# build
npm run build
```

## FAQ

- If browser is close by manually, the process will not exit.
