/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
import React from "react";
import styled, { css } from "styled-components";
import palette from "../../styles/palette";
import { useSelector } from "../../store";

const Container = styled.div<{ isValid: boolean; validateMode: boolean }>`
  width: 100%;
  height: 46px;

  select {
    width: 100%;
    height: 100%;
    background-color: white;
    border: 1px solid ${palette.gray_f7};
    padding: 0 11px;
    border-radius: 4px;
    outline: none;
    -webket-appearance: none;
    font-size: 16px;

    &:focus {
      border-color: ${palette.dark_cyan};
    }
  }

  ${({ isValid, validateMode }) =>
    validateMode &&
    css`
      select {
        border-color: ${isValid ? palette.dark_cyan : palette.tawny} !important;

        background-color: ${isValid ? "white" : palette.snow};
      }
    `}
`;

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /* eslint-disable react/require-default-props */
  options?: string[];
  disabledOptions?: string[];
  value?: string;
  isValid?: boolean;
}

const Selector: React.FC<IProps> = ({
  options = [],
  disabledOptions = [],
  isValid,
  ...props
}) => {
  const validateMode = useSelector((state) => state.common.validateMode);
  return (
    <Container isValid={!!isValid} validateMode={validateMode}>
      <select {...props}>
        {disabledOptions.map((option, index) => (
          /* eslint-disable react/no-array-index-key */
          <option key={index} value={option} disabled>
            {option}
          </option>
        ))}
        {options.map((option, index) => (
          /* eslint-disable react/no-array-index-key */
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Container>
  );
};

export default Selector;
