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
import { authActions } from "../../store/auth";

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
    margin-bottom: 30px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${palette.gray_eb};
  }

  .sign-up-modal-set-login {
    color: ${palette.gray_48};
    font-size: 15px;
    span {
      color: ${palette.dark_cyan};
      margin-left: 8px;
      cursor: pointer;
    }
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

  //* ????????? ?????? ?????? ???
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  //* ?????? ?????? ???
  const onChangeLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(e.target.value);
  };

  //* ??? ?????? ???
  const onChangeFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(e.target.value);
  };

  //* ???????????? ?????? ???
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //* ???????????? ??? ?????? ???
  const onChangeBirthMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthMonth(e.target.value);
  };

  //* ???????????? ??? ?????? ???
  const onChangeBirthDay = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthDay(e.target.value);
  };

  //* ???????????? ??? ?????? ???
  const onChangeBirthYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBirthYear(e.target.value);
  };

  //* ???????????? ?????? ????????????
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  //* ???????????? ?????? ????????? ????????? ???
  //* ???????????? ???????????? ????????? ???????????? ????????? ??? ??? ?????? ?????? ????????? ???????????????
  const onFocusPassword = () => {
    setPasswordFocused(true);
  };

  //* password??? ???????????? ???????????? ???????????????
  //* useMemo??? ????????? ?????? ?????? ?????? ????????? ???????????? ??? ????????? ??????
  const isPasswordHasNameOrEmail = useMemo(
    () =>
      !password ||
      !lastname ||
      password.includes(lastname) ||
      password.includes(email.split("@")[0]),
    [password, lastname, email]
  );

  //* ???????????? ?????? ?????????
  const PASSWORD_MIN_LENGTH = 8;

  const isPasswordOverMinLength = useMemo(
    () => !!password && password.length >= PASSWORD_MIN_LENGTH,
    [password]
  );

  //* ??????????????? ????????? ??????????????? ???????????????
  const isPasswordHasNumberOrSymbol = useMemo(
    () =>
      !(
        /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) ||
        /[0-9]/g.test(password)
      ),
    [password]
  );

  //* ???????????? ??? ?????? ??? ????????????
  const validateSignUpForm = () => {
    //* ?????? ?????? ?????????
    if (!email || !lastname || !firstname || !password) {
      return false;
    }
    //* ??????????????? ???????????? ?????????
    if (
      isPasswordHasNameOrEmail ||
      !isPasswordOverMinLength ||
      isPasswordHasNumberOrSymbol
    ) {
      return false;
    }
    //* ???????????? ????????? ?????? ?????????
    if (!birthDay || !birthMonth || !birthYear) {
      return false;
    }
    return true;
  };

  //* ????????? ????????? validateMode ???????????? ?????????,
  //* validateMode??? ?????? ????????? ???????????? ????????????
  //* ???????????? ???????????? ??? validateMode ?????????
  useEffect(() => {
    return () => {
      setValidateMode(false);
    };
  }, []);

  //* ???????????? ??? ????????????
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
            `${birthYear}-${birthMonth!.replace("???", "")}-${birthDay}`
          ).toISOString(),
        };
        const { data } = await signupAPI(signUpBody);

        //* ???????????? ???????????? ????????? ????????? ???????????? ??????
        dispatch(userActions.setLoggedUser(data));

        closeModal();
      } catch (error) {
        console.log(error);
      }
    }
  };

  //* ????????? ????????? ??????
  const changeToLoginModal = () => {
    dispatch(authActions.setAuthMode("login"));
  };

  return (
    <Container onSubmit={onSubmitSignUp}>
      <CloseXIcon className="modal-close-x-icon" onClick={closeModal} />
      <p className="sign-up-birthday-label">????????????</p>
      <p className="sign-up-modal-birthday-info">?????? ????????? ??????????????????.????</p>
      <div className="input-wrapper">
        <Input
          placeholder="?????? ??????"
          type="email"
          icon={<MailIcon style={{ top: 16 }} />}
          name="email"
          value={email}
          onChange={onChangeEmail}
          // validateMode={validateMode}
          useValidation
          isValid={!!email}
          errorMessage="???? ????????? ??????????????????."
        />
      </div>
      <div className="input-wrapper">
        <Input
          placeholder="??????"
          icon={<PersonIcon style={{ top: 15 }} />}
          value={lastname}
          onChange={onChangeLastname}
          // validateMode={validateMode}
          useValidation
          isValid={!!lastname}
          errorMessage="???? ????????? ??????????????????."
        />
      </div>
      <div className="input-wrapper">
        <Input
          placeholder="???"
          icon={<PersonIcon style={{ top: 15 }} />}
          value={firstname}
          onChange={onChangeFirstname}
          // validateMode={validateMode}
          useValidation
          isValid={!!firstname}
          errorMessage="???? ?????? ??????????????????."
        />
      </div>
      <div className="input-wrapper sign-up-password-input-wrapper">
        <Input
          placeholder="???? ????????????"
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
          errorMessage="???? ??????????????? ??????????????????."
          onFocus={onFocusPassword}
        />
      </div>
      {passwordFocused && (
        <div className="password-warning-box">
          <PasswordWarning
            isValid={isPasswordHasNameOrEmail}
            text="??????????????? ???????????? ????????? ????????? ????????? ??? ????????????!"
          />
          <PasswordWarning
            isValid={!isPasswordOverMinLength}
            text="??????????????? ?????? 8??? ??????????????? ?????????!"
          />
          <PasswordWarning
            isValid={isPasswordHasNumberOrSymbol}
            text="??????????????? ????????? ????????? ??????????????????!"
          />
        </div>
      )}
      <p className="sign-up-birthday-label">??????</p>
      <p className="sign-up-modal-birthday-info">????????? ???????????????!????</p>
      <div className="sign-up-modal-birthday-selectors">
        <div className="sign-up-modal-birthday-month-selector">
          <Selector
            options={monthList}
            disabledOptions={["???"]}
            defaultValue="???"
            isValid={!!birthMonth}
            value={birthMonth}
            onChange={onChangeBirthMonth}
          />
        </div>
        <div className="sign-up-modal-birthday-day-selector">
          <Selector
            options={dayList}
            disabledOptions={["???"]}
            defaultValue="???"
            isValid={!!birthDay}
            value={birthDay}
            onChange={onChangeBirthDay}
          />
        </div>
        <div className="sign-up-modal-birthday-year-selector">
          <Selector
            options={yearList}
            disabledOptions={["???"]}
            defaultValue="???"
            isValid={!!birthYear}
            value={birthYear}
            onChange={onChangeBirthYear}
          />
        </div>
      </div>
      <div className="sign-up-modal-submit-button-wrapper">
        <Button type="submit">????????????</Button>
      </div>
      <p className="sign-up-modal-set-login">
        ?????? ?????????????????? ????????? ??????????
        <span role="presentation" onClick={changeToLoginModal}>
          ?????????
        </span>
      </p>
    </Container>
  );
};

export default SignUpModal;
