import { getCookieValue } from "../src";

getCookieValue({
  cookieName: "user_session",
  url: "https://github.com/",
}).then(resp => {
  console.log("cookie：", resp);
}).catch(error => {
  console.log(error);
});
