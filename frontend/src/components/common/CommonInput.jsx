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
  validation,
  disabled,
  placeholder,
  error,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
}) {
  const [showPassword, setShowPassword] = useState(false);

  console.log("error", error);

  return (
    <>
      <InputStyled>
        <input
          type={showPassword ? "text" : type}
          name={name}
          // {...register(name, validation)}
          ref={register(validation)}
          // {value ? (value = { value }) : null}
          // defaultValue={defaultValue || undefined}
          onChange={(value) => {
            console.log("onchange", value);
            // setValue(value);
            if (onChange) {
              onChange(value);
            }
          }}
          onBlur={onBlur || undefined}
          onFocus={onFocus || undefined}
          disabled={disabled}
          placeholder={placeholder || undefined}
        />
        {type === "password" && (
          <LockStyled onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <UnlockFilled /> : <LockFilled />}
          </LockStyled>
        )}
      </InputStyled>

      {error?.message && <ErrorStyled>{error.message}</ErrorStyled>}
    </>
  );
}

export default CommonInput;
