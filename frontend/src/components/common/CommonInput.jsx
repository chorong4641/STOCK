import React, { useState } from "react";
import styled from "styled-components";
import { UnlockFilled, LockFilled } from "@ant-design/icons";

const InputStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    position: relative;
    width: 100%;
    height: "40px"
    padding: "0px 35px 0px 10px"
    font-size: "15px"
    border: 1px solid #b1b1b1;
    border-radius: 3px;
    outline: none;

    &.disabled {
      background-color: #fbfbfb;
      opacity: 0.7;
      pointer-events: none;
    }
  }

  input[type="number"] {
    height: "45px";
    padding-left: 10px;
    background-color: #fff;
    font-size: 18px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  textarea {
    padding: 5px;
    resize: none;
    border-radius: 5px;
    border: 1px solid #b1b1b1;
    outline: none;
  }
`;

const LockStyled = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

const ErrorStyled = styled.div`
  margin-top: 3px;
  color: #9d141d;
  font-size: 13px;
`;

function CommonInput({
  name,
  type,
  register,
  validation = {},
  disabled,
  placeholder,
  error,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  style,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <InputStyled style={{ ...style }}>
        {type === "textarea" ? (
          <textarea
            className={disabled ? "disabled" : ""}
            name={name}
            ref={register(validation)}
            onChange={(value) => {
              if (onChange) {
                onChange(value);
              }
            }}
          ></textarea>
        ) : (
          <>
            <input
              className={disabled ? "disabled" : ""}
              type={showPassword ? "text" : type}
              name={name}
              ref={register(validation)}
              onChange={(value) => {
                if (onChange) {
                  onChange(value);
                }
              }}
              defaultValue={defaultValue || undefined}
              onBlur={onBlur || undefined}
              onFocus={onFocus || undefined}
              placeholder={placeholder || undefined}
            />
            {type === "password" && (
              <LockStyled onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <UnlockFilled /> : <LockFilled />}
              </LockStyled>
            )}
          </>
        )}
      </InputStyled>

      {error?.message && <ErrorStyled>{error.message}</ErrorStyled>}
    </>
  );
}

export default CommonInput;
