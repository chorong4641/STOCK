import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CommonInput from "./common/CommonInput";
import { validEmail, validRequired } from "../utils/validation";
import { LayoutStyled } from "./common/Styled";

const FindIdStyled = styled(LayoutStyled)`
  //
`;

function FindId() {
  const history = useHistory();
  const { errors, register, handleSubmit } = useForm({ mode: "onBlur" });
  const [userId, setUserId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 아이디 찾기
  const onFindId = async (formData) => {
    // 에러 메시지 초기화
    setErrorMsg("");

    const { email, name } = formData;
    const params = {
      email,
      name,
    };

    await axios
      .post(`/api/user/find_id`, params)
      .then((res) => {
        if (!res?.data?.error) {
          setUserId(res.data?.data?.id);
        } else {
          setErrorMsg("사용자 정보가 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.log("onFindId", error);
      });
  };
  
  return (
    <FindIdStyled>
      <form onSubmit={handleSubmit(onFindId)} autoComplete="off">
        <div className="page-title">EASY STOCK</div>

        {userId ? (
          <div className="find-result">
            <div className="find-text">
              아이디는 <b>{userId}</b>입니다.
            </div>
            <button onClick={() => history.push("/login")}>로그인 하러가기</button>
          </div>
        ) : (
          <>
            <div className="input-item">
              <div className="label">이메일</div>
              <CommonInput
                type="text"
                name="email"
                error={errors.email}
                register={register}
                validation={{
                  validate: { required: (value) => validRequired(value), email: (value) => validEmail(value) },
                }}
              />
            </div>

            <div className="input-item">
              <div className="label">이름</div>
              <CommonInput
                type="text"
                name="name"
                error={errors.name}
                register={register}
                validation={{
                  validate: { required: (value) => validRequired(value) },
                }}
              />
            </div>

            {/* 에러 메시지 */}
            {!!errorMsg && <div className="error-message">{errorMsg}</div>}

            <button type="submit" className="login-btn">
              아이디 찾기
            </button>
          </>
        )}
      </form>
    </FindIdStyled>
  );
}

export default FindId;
