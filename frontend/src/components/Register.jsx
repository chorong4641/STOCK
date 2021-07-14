import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CommonInput from "./common/CommonInput";
import { validRequired, validEmail } from "../utils/validation";

const RegisterStyled = styled.div`
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

    .register-btn {
      height: 35px;
      margin-top: 40px;
      color: #fff;
      background-color: #9d141d;
    }
  }
`;
function Register(props) {
  const history = useHistory();
  const {
    // formState: { errors },
    errors,
    watch,
    register,
    handleSubmit,
  } = useForm({ mode: "all" });
  const watchValues = watch();

  const onRegister = async (formData) => {
    const params = {
      id: formData.id,
      pw: formData.pw,
      name: formData.name,
      email: formData.email,
    };

    await axios
      .post(`/api/user/register`, params)
      .then((res) => {
        if (!res?.data?.error) {
          history.push(`/login`);
        } else {
          //
        }
      })
      .catch((error) => {
        console.log("onRegister", error);
      });
  };

  return (
    <RegisterStyled>
      <form onSubmit={handleSubmit(onRegister)} autoComplete="off">
        <div className="page-title">EASY STOCK</div>

        <div className="input-item">
          <div className="label">아이디</div>
          <CommonInput
            type="text"
            name="id"
            error={errors.id}
            register={register}
            validation={{ validate: { required: (value) => validRequired(value) } }}
          />
        </div>
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
        <div className="input-item">
          <div className="label">이름</div>
          <CommonInput
            type="text"
            name="name"
            error={errors.name}
            register={register}
            validation={{ validate: { required: (value) => validRequired(value) } }}
          />
        </div>
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

        <button type="submit" className="register-btn">
          회원가입
        </button>
      </form>
    </RegisterStyled>
  );
}

export default Register;
