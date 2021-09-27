import React from "react";
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

function FindPwd(props) {
  const history = useHistory();
  const { errors, register, handleSubmit } = useForm({ mode: "all" });

  const onFindPwd = async (formData) => {
    const params = {
      ...formData,
    };

    // await axios
    //   .post(`/api/user/FindPwd`, params)
    //   .then((res) => {
    //     if (!res?.data?.error) {
    //       //
    //     } else {
    //       //
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("onFindPwd", error);
    //   });
    //
  };

  return (
    <FindPwdStyled>
      <form onSubmit={handleSubmit(onFindPwd)} autoComplete="off">
        <div className="page-title">EASY STOCK</div>

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

        <button type="submit" className="login-btn">
          비밀번호 찾기
        </button>
      </form>
    </FindPwdStyled>
  );
}

export default FindPwd;
