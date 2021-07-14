import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CommonInput from "./common/CommonInput";
import { validEmail, validRequired } from "../utils/validation";

const FindPwdStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;

  form {
    position: relative;
    width: 500px;
    height: inherit;
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .page-title {
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    .input-item {
      margin-top: 20px;

      .label {
        margin-bottom: 5px;
        color: #3f4753;
      }
    }

    .login-btn {
      height: 35px;
      margin-top: 40px;
      color: #fff;
      background-color: #9d141d;
    }

    .extra-link {
      margin: 40px auto;

      a {
        padding: 0 10px;
        color: #3f4753;
        font-size: 13px;
        border-right: 1px solid #b1b1b1;

        &:last-child {
          border: none;
        }
      }
    }
  }
`;
function FindPwd(props) {
  const history = useHistory();
  const { errors, register, handleSubmit } = useForm({ mode: "all" });

  const onFindPwd = async (formData) => {
    console.log("formData", formData);
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

        <button type="submit" className="login-btn">
          비밀번호 찾기
        </button>
      </form>
    </FindPwdStyled>
  );
}

export default FindPwd;
