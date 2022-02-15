import App, { AppProps, AppContext } from "next/app";
import Header from "../components/Header";
import GlobalStyle from "../styles/GlobalStyles";
import { wrapper } from "../store";
import { cookieStringToObject } from "../lib/utils";

const app = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Component {...pageProps} />
      <div id="root-modal" />
    </>
  );
};

//* 쿠키에 access_token이 있는 것은 유저가 로그인되어 있음을 의미
//* 모든 페이지에서 유저가 페이지에 접속했을 때 access_token이 있다면
//* 유저의 정보 불러와 리덕스 스토어에 저장해 로그인된 상태로 만들어야 함

//* App 컴포넌트에서 쿠키의 access_token을 서버로 보내 유저 정보 받아오기
//* 유저 정보 받아와 유저 정보를 리덕스 스토어에 저장하기

//* 모든 페이지에서 로그인 정보 불러올 수 있도록 App 컴포넌트의 getInitialProps 사용하기
app.getInitialProps = async (context: AppContext) => {
  const appInitialProps = await App.getInitialProps(context);
  const cookieObject = cookieStringToObject(context.ctx.req?.headers.cookie);
  console.log(cookieObject);
  return { ...appInitialProps };
};

export default wrapper.withRedux(app);
