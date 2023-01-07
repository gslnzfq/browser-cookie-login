import { getCookieValue } from "../src";

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
