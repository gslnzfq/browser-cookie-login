import { Browser, remote } from "webdriverio";
import * as http from "http";
import { AddressInfo } from "net";
import { RemoteCapability } from "@wdio/types/build/Capabilities";
import { Server } from "http";

// 睡眠x秒
const sleep = async (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

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

const defaultOption: Partial<IOptions> = {
  retryInterval: 1,
  successMessage: "你已经登录成功，浏览器即将关闭！",
  successShowDuration: 3,
  capabilities: {browserName: "chrome"},
  resolveResult: async () => {
    return true;
  }
};

const createServer = (opts: IOptions): Promise<Server> => {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(opts.successMessage);
    });
    server.on('listening', () => {
      resolve(server);
    });
    // 监听随机端口
    server.listen(0);
  });
};

/**
 * 获取cookie的数据
 * @param options
 */
export const getCookieValue = async (options: IOptions): Promise<string> => {
  // 合并配置
  const opts = {...defaultOption, ...options} as Required<IOptions>;
  return new Promise(async (resolve, reject) => {
    const server = await createServer(opts);
    const port = (server.address() as AddressInfo).port;
    let browser;
    // 浏览器端
    try {
      browser = await remote({
        logLevel: "silent",
        capabilities: opts.capabilities,
      });
      await browser.navigateTo(opts.url);
      while (true) {
        try {
          // 如果获取不到对应的cookie信息，会到catch
          const cookie = await browser.getNamedCookie(opts.cookieName);
          if (cookie.value) {
            const resolved = await opts.resolveResult(browser);
            if (resolved) {
              // 浏览器展示登录成功
              await browser.navigateTo(`http://127.0.0.1:${port}/`);
              // 展示三秒后关闭浏览器，关闭服务器
              await sleep(opts.successShowDuration);
              await browser.deleteSession();
              await server.close();
              // 返回结果
              resolve(cookie.value);
              break;
            }
          }
        } catch (err: any) {
          // 获取失败后，等待x秒再去获取
          if (err.message.indexOf('No cookie with name') > -1) {
            await sleep(opts.retryInterval);
          } else {
            throw new Error(err.message);
          }
        }
      }
    } catch (err: any) {
      await server.close();
      await browser.deleteSession();
      reject(err.message);
    }
  });
};

