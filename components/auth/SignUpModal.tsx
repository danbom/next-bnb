/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import CloseXIcon from "../../public/static/svg/modal/modal_close_x_icon.svg";
import MailIcon from "../../public/static/svg/auth/mail.svg";
import PersonIcon from "../../public/static/svg/auth/person.svg";
import OpenedEyeIcon from "../../public/static/svg/auth/opened_eye.svg";
import ClosedEyeIcon from "../../public/static/svg/auth/closed_eye.svg";
import palette from "../../styles/palette";
import Input from "../common/Input";
import { dayList, monthList, yearList } from "../../lib/staticData";
import Selector from "../common/Selector";
import Button from "../common/Button";
import { signupAPI } from "../../lib/api/auth";
import { userActions } from "../../store/user";
// import { commonActions } from "../../store/common";
import useValidateMode from "../../hooks/useValidateMode";
import PasswordWarning from "./PasswordWarning";

const Container = styled.form`
  width: 568px;
  // height: 670px;
  height: max-content;
  padding: 32px;
  background-color: white;
  z-index: 11;
  border-radius: 7px;

  .modal-close-x-icon {
    cursor: pointer;
    display: block;
    margin: 0 0 10px auto;
  }

  .input-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  .sign-up-password-input-wrapper {
    margin-bottom: 15px;
    svg {
      cursor: pointer;
    }
  }

  .password-warning-box {
    font-size: 15px;
    margin-bottom: 35px;
  }

  .sign-up-birthday-label {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .sign-up-modal-birthday-info {
    margin-bottom: 16px;
    color: ${palette.charcoal};
  }

  .sign-up-modal-birthday-selectors {
    display: flex;
    margin-bottom: 25px;

    .sign-up-modal-birthday-month-selector {
      margin-right: 16px;
      flex-grow: 1;
    }

    .sign-up-modal-birthday-day-selector {
      margin-right: 16px;
      width: 25%;
    }

    .sign-up-modal-birthday-year-selector {
      width: 33.3333%;
    }
  }

  .sign-up-modal-submit-button-wrapper {
    margin-bottom: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${palette.gray_eb};
  }
`;

interface IProps {
  closeModal: () => void;
}

const SignUpModal: React.FC<IProps> = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [birthYear, setBirthYear] = useState<string | undefined>();
  const [birthDay, setBirthDay] = useState<string | undefined>();
  const [birthMonth, setBirthMonth] = useState<string | undefined>();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { setValidateMode } = useValidateMode();

  const dispatch = useDispatch();

  //* 이메일 주소 변경 시
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  //* 이름 변경 시
  const onChangeLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(e.target.value);
  };

  //* 성 변경 시
  const onChangeFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(e.target.value);
  };

  //* 비밀번호 변경 시
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //* 생년월일 월 변경 시
  const onChangeBirthMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthMonth(e.target.value);
  };

  //* 생년월일 일 변경 시
  const onChangeBirthDay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthDay(e.target.value);
  };

  //* 생년월일 년 변경 시
  const onChangeBirthYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthYear(e.target.value);
  };

  //* 비밀번호 숨김 토글하기
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  //* 비밀번호 인풋 포커스 되었을 때
  //* 비밀번호 설정하기 인풋에 포커싱이 되었을 때 세 가지 체크 옵션이 나타나도록
  const onFocusPassword = () => {
    setPasswordFocused(true);
  };

  //* password가 이름이나 이메일을 포함하는지
  //* useMemo를 사용해 관련 없는 값의 변화가 발생했을 때 재계산 방지
  const isPasswordHasNameOrEmail = useMemo(
    () =>
      !password ||
      !lastname ||
      password.includes(lastname) ||
      password.includes(email.split("@")[0]),
    [password, lastname, email]
  );

  //* 비밀번호 최소 자릿수
  const PASSWORD_MIN_LENGTH = 8;

  const isPasswordOverMinLength = useMemo(
    () => !!password && password.length >= PASSWORD_MIN_LENGTH,
    [password]
  );

  //* 비밀번호가 숫자나 특수기호를 포함하는지
  const isPasswordHasNumberOrSymbol = useMemo(
    () =>
      !(
        /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) ||
        /[0-9]/g.test(password)
      ),
    [password]
  );

  //* 회원가입 폼 입력 값 확인하기
  const validateSignUpForm = () => {
    //* 인풋 값이 없다면
    if (!email || !lastname || !firstname || !password) {
      return false;
    }
    //* 비밀번호가 올바르지 않다면
    if (
      isPasswordHasNameOrEmail ||
      !isPasswordOverMinLength ||
      isPasswordHasNumberOrSymbol
    ) {
      return false;
    }
    //* 생년월일 셀렉터 값이 없다면
    if (!birthDay || !birthMonth || !birthYear) {
      return false;
    }
    return true;
  };

  //* 리덕스 사용해 validateMode 사용했기 때문에,
  //* validateMode가 다른 곳에서 사용되지 않으려면
  //* 컴포넌트 언마운트 시 validateMode 꺼주기
  useEffect(() => {
    return () => {
      setValidateMode(false);
    };
  }, []);

  //* 회원가입 폼 제출하기
  const onSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidateMode(true);
    console.log(validateSignUpForm());
    // dispatch(commonActions.setValidateMode(true));

    if (validateSignUpForm()) {
      try {
        const signUpBody = {
          email,
          lastname,
          firstname,
          password,
          birthday: new Date(
            `${birthYear}-${birthMonth!.replace("월", "")}-${birthDay}`
          ).toISOString(),
        };
        const { data } = await signupAPI(signUpBody);

        //* 회원가입 완료하면 새로운 유저를 리덕스에 저장
        dispatch(userActions.setLoggedUser(data));

        closeModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container onSubmit={onSubmitSignUp}>
      <CloseXIcon className="modal-close-x-icon" onClick={closeModal} />
      <p className="sign-up-birthday-label">회원가입</p>
      <p className="sign-up-modal-birthday-info">기본 정보를 입력해주세요.🤫</p>
      <div className="input-wrapper">
        <Input
          placeholder="✉️ 메일"
          type="email"
          icon={<MailIcon style={{ top: 16 }} />}
          name="email"
          value={email}
          onChange={onChangeEmail}
          // validateMode={validateMode}
          useValidation
          isValid={!!email}
          errorMessage="😳 메일을 입력해주세요."
        />
      </div>
      <div className="input-wrapper">
        <Input
          placeholder="이름"
          icon={<PersonIcon style={{ top: 15 }} />}
          value={lastname}
          onChange={onChangeLastname}
          // validateMode={validateMode}
          useValidation
          isValid={!!lastname}
          errorMessage="😳 이름을 입력해주세요."
        />
      </div>
      <div className="input-wrapper">
        <Input
          placeholder="성"
          icon={<PersonIcon style={{ top: 15 }} />}
          value={firstname}
          onChange={onChangeFirstname}
          // validateMode={validateMode}
          useValidation
          isValid={!!firstname}
          errorMessage="😳 성을 입력해주세요."
        />
      </div>
      <div className="input-wrapper sign-up-password-input-wrapper">
        <Input
          placeholder="🔑 비밀번호"
          type={hidePassword ? "password" : "text"}
          icon={
            hidePassword ? (
              <ClosedEyeIcon style={{ top: 20 }} onClick={toggleHidePassword} />
            ) : (
              <OpenedEyeIcon style={{ top: 15 }} onClick={toggleHidePassword} />
            )
          }
          value={password}
          onChange={onChangePassword}
          // validateMode={validateMode}
          useValidation
          isValid={
            !isPasswordHasNameOrEmail &&
            isPasswordOverMinLength &&
            !isPasswordHasNumberOrSymbol
          }
          errorMessage="😳 비밀번호을 입력해주세요."
          onFocus={onFocusPassword}
        />
      </div>
      {passwordFocused && (
        <div className="password-warning-box">
          <PasswordWarning
            isValid={isPasswordHasNameOrEmail}
            text="비밀번호에 이름이나 이메일 주소를 포함할 수 없습니다!"
          />
          <PasswordWarning
            isValid={!isPasswordOverMinLength}
            text="비밀번호는 최소 8자 이상이어야 합니다!"
          />
          <PasswordWarning
            isValid={isPasswordHasNumberOrSymbol}
            text="비밀번호에 숫자나 기호를 포함해주세요!"
          />
        </div>
      )}
      <p className="sign-up-birthday-label">생일</p>
      <p className="sign-up-modal-birthday-info">성인만 가능합니당!😎</p>
      <div className="sign-up-modal-birthday-selectors">
        <div className="sign-up-modal-birthday-month-selector">
          <Selector
            options={monthList}
            disabledOptions={["월"]}
            defaultValue="월"
            isValid={!!birthMonth}
            value={birthMonth}
            onChange={onChangeBirthMonth}
          />
        </div>
        <div className="sign-up-modal-birthday-day-selector">
          <Selector
            options={dayList}
            disabledOptions={["일"]}
            defaultValue="일"
            isValid={!!birthDay}
            value={birthDay}
            onChange={onChangeBirthDay}
          />
        </div>
        <div className="sign-up-modal-birthday-year-selector">
          <Selector
            options={yearList}
            disabledOptions={["년"]}
            defaultValue="년"
            isValid={!!birthYear}
            value={birthYear}
            onChange={onChangeBirthYear}
          />
        </div>
      </div>
      <div className="sign-up-modal-submit-button-wrapper">
        <Button type="submit">가입하기</Button>
      </div>
    </Container>
  );
};

export default SignUpModal;
