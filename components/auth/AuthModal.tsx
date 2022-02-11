import React from "react";
import styled from "styled-components";
import SignUpModal from "./SignUpModal";
import { useSelector, RootState } from "../../store";

interface IProps {
  closeModal: () => void;
}

const Container = styled.div`
  z-index: 11;
`;

const AuthModal: React.FC<IProps> = ({ closeModal }) => {
  const authMode = useSelector((state: RootState) => state.auth.authMode);

  return (
    <Container>
      {authMode === "signup" && <SignUpModal closeModal={closeModal} />}
      {authMode === "login" && <div>로그인</div>}
    </Container>
  );
};

export default AuthModal;
