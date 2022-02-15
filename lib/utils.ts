/* eslint-disable import/prefer-default-export */
//* 쿠키 문자열을 쿠키객체로 만드는 함수
//* "token=value"를 {token:"value"}로 바꾸는 함수
export const cookieStringToObject = (cookieString: string | undefined) => {
  const cookies: { [key: string]: string } = {};
  if (cookieString) {
    //* "token=vale"
    const itemString = cookieString?.split(/\s*;\s*/);
    itemString.forEach((pairs) => {
      //* ["token", "value"]
      const pair = pairs.split(/\s*;\s*/);
      cookies[pair[0]] = pair.splice(1).join("=");
    });
  }
  return cookies;
};
