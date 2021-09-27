import React from "react";
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

function FindId(props) {
  const history = useHistory();
  const { errors, register, handleSubmit } = useForm({ mode: "all" });

  const onFindId = async (formData) => {
    const params = {
      ...formData,
    };

    // await axios
    //   .post(`/api/user/findId`, params)
    //   .then((res) => {
    //     if (!res?.data?.error) {
    //       //
    //     } else {
    //       //
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("onFindId", error);
    //   });
    //
  };

  return (
    <FindIdStyled>
      <form onSubmit={handleSubmit(onFindId)} autoComplete="off">
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

        <button type="submit" className="login-btn">
          아이디 찾기
        </button>
      </form>
    </FindIdStyled>
  );
}

export default FindId;
