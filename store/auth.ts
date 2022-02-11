/* eslint-disable no-param-reassign */
//* 리덕스 사용해 모달 종류 선택할 수 있게 하기
//* 리덕스에 모달 종류를 저장할 값 가지는 모듈 만들기
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//* 초기 상태
const initialState: { authMode: "signup" | "login" } = {
  authMode: "signup",
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //* 인증 팝업 변경하기
    setAuthMode(state, action: PayloadAction<"signup" | "login">) {
      state.authMode = action.payload;
    },
  },
});

export const authActions = { ...auth.actions };

export default auth;
