import React, { useState } from "react";
import styled from "styled-components";
import CloseXIcon from "../../public/static/svg/modal/modal_close_x_icon.svg";
import MailIcon from "../../public/static/svg/auth/mail.svg";
import ClosedEyeIcon from "../../public/static/svg/auth/closed_eye.svg";
import OpenedEyeIcon from "../../public/static/svg/auth/opened_eye.svg";
import palette from "../../styles/palette";
import Button from "../common/Button";
import Input from "../common/Input";

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

  .login-input-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  .login-password-input-wrapper {
    margin-bottom: 15px;
    svg {
      cursor: pointer;
    }
  }

  .login-modal-submit-button-wrapper {
    margin-bottom: 30px;
    padding-bottom: 4px;
    border-bottom: 1px solid ${palette.gray_eb};
  }

  .login-modal-set-signup {
    color: ${palette.gray_48};
    font-size: 15px;
    span {
      color: ${palette.dark_cyan};
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .login-label {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .login-label-desc {
    margin-bottom: 16px;
    color: ${palette.charcoal};
  }
`;

interface IProps {
  closeModal: () => void;
}

const LoginModal: React.FC<IProps> = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPasswordHided, setIsPasswordHided] = useState(true);

  //* 이메일 주소 변경시
  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  //* 비밀번호 변경 시
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  //* isPasswordHided 토글
  const togglePasswowrdHiding = () => {
    setIsPasswordHided(!isPasswordHided);
  };

  return (
    <Container>
      <CloseXIcon className="modal-close-x-icon" onClick={closeModal} />
      <p className="login-label">로그인</p>
      <p className="login-label-desc">로그인 정보를 입력해주세요.🤫</p>
      <div className="login-input-wrapper">
        <Input
          placeholder="✉️ 메일"
          type="email"
          icon={<MailIcon style={{ top: 16 }} />}
          name="email"
          value={email}
          onChange={onChangeEmail}
        />
      </div>
      <div className="login-input-wrapper login-password-input-wrapper">
        <Input
          placeholder="🔑 비밀번호"
          type={isPasswordHided ? "password" : "text"}
          icon={
            isPasswordHided ? (
              <ClosedEyeIcon
                style={{ top: 20 }}
                onClick={togglePasswowrdHiding}
              />
            ) : (
              <OpenedEyeIcon
                style={{ top: 20 }}
                onClick={togglePasswowrdHiding}
              />
            )
          }
          name="password"
          value={password}
          onChange={onChangePassword}
        />
      </div>
      <div className="login-modal-submit-button-wrapper">
        <Button type="submit">로그인</Button>
      </div>
      <p className="login-modal-set-signup">
        넥스트비앤비 계정이 없나요?
        <span role="presentation" onClick={() => {}}>
          회원가입
        </span>
      </p>
    </Container>
  );
};

export default LoginModal;
