import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CommonInput from "./common/CommonInput";
import { validEmail, validRequired } from "../utils/validation";
import { LayoutStyled } from "./common/Styled";

const FindPwdStyled = styled(LayoutStyled)`
  //
`;

function FindPwd() {
  const history = useHistory();
  const { errors, register, handleSubmit, watch } = useForm({ mode: "onBlur" });
  const watchValues = watch();
  // 에러 메시지
  const [errorMsg, setErrorMsg] = useState("");
  // 비밀번호 재설정 완료 여부
  const [finish, setFinish] = useState(false);

  // 사용자 정보 확인
  const onCheckInfo = async (formData) => {
    // 에러 메시지 초기화
    setErrorMsg("");

    const { email, name, id } = formData;
    const params = {
      email,
      name,
      id,
    };

    await axios
      .post(`/api/user/confirm_pw`, params)
      .then((res) => {
        if (!res?.data?.error) {
          // 비밀번호 재설정 api 호출
          onSetPwd(formData);
        } else {
          setErrorMsg("사용자 정보가 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.log("onCheckInfo", error);
      });
  };

  // 비밀번호 재설정
  const onSetPwd = async (formData) => {
    const params = {
      id: formData.id,
      pw: formData.pw,
    };

    await axios
      .post(`/api/user/reset_pw`, params)
      .then((res) => {
        if (!res?.data?.error) {
          setFinish(true);
        } else {
          setErrorMsg("사용자 정보가 올바르지 않습니다.");
        }
      })
      .catch((error) => {
        console.log("onSetPwd", error);
      });
  };

  return (
    <FindPwdStyled>
      <form onSubmit={handleSubmit(onCheckInfo)} autoComplete="off">
        <div className="page-title">EASY STOCK</div>
        {!finish ? (
          // 이메일, 이름, 아이디, 비밀번호, 비밀번호 확인
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
            <div className="input-item">
              <div className="label">아이디</div>
              <CommonInput
                type="text"
                name="id"
                error={errors.id}
                register={register}
                validation={{
                  validate: { required: (value) => validRequired(value) },
                }}
              />
            </div>
            {/* 사용자 정보 에러 메시지 */}
            {!!errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="input-item">
              <div className="label">비밀번호</div>
              <CommonInput
                type="password"
                name="pw"
                error={errors.pw}
                register={register}
                validation={{ validate: { required: (value) => validRequired(value) } }}
              />
            </div>
            <div className="input-item">
              <div className="label">비밀번호 확인</div>
              <CommonInput
                type="password"
                name="pwCheck"
                error={errors.pwCheck}
                register={register}
                validation={{
                  validate: {
                    required: (value) => validRequired(value),
                    matched: (value) => (value === watchValues.pw ? undefined : "비밀번호가 일치하지 않습니다."),
                  },
                }}
              />
            </div>

            {/* 비밀번호 재설정 버튼 */}
            <button type="submit" className="login-btn">
              비밀번호 재설정
            </button>
          </>
        ) : (
          // 비밀번호 재설정 완료 화면
          <div className="find-result">
            <div className="find-text">비밀번호가 재설정되었습니다.</div>
            <button onClick={() => history.push("/login")}>로그인 하러가기</button>
          </div>
        )}
      </form>
    </FindPwdStyled>
  );
}

export default FindPwd;
