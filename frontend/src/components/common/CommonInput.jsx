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
    padding: 5px 35px 5px 5px;
    border: 1px solid #b1b1b1;
    border-radius: 3px;
    outline: none;

    &.disabled {
      background-color: #fbfbfb;
      opacity: 0.7;
      pointer-events: none;
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
