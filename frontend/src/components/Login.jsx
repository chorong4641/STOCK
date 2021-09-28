import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { store } from "../store";
import { login } from "../store/actions";
import CommonInput from "./common/CommonInput";
import { validRequired } from "../utils/validation";
import { LayoutStyled } from "./common/Styled";

const LoginStyled = styled(LayoutStyled)`
  .extra-link {
    margin: 40px auto;

    a {
      padding: 0 10px;
      color: #3f4753;
      border-right: 1px solid #b1b1b1;

      &:last-child {
        border: none;
      }
    }
  }
`;

function Login(props) {
  const history = useHistory();
  const [state, dispatch] = useContext(store);
  const { errors, register, handleSubmit } = useForm({ mode: "all" });
  const [errorMsg, setErrorMsg] = useState("");

  const onLogin = async (formData) => {
    const params = {
      ...formData,
    };

    await axios
      .post(`/api/user/login`, params)
      .then((res) => {
        if (!res?.data?.error) {
          dispatch(login(res.data.data));
          history.push(`/stock`);
        } else {
          setErrorMsg("아이디/비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => {
        console.log("onLogin", error);
      });
    //
  };

  return (
    <LoginStyled>
      <form onSubmit={handleSubmit(onLogin)} autoComplete="off">
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

        {/* 에러 메시지 */}
        {!!errorMsg && <div className="error-message">{errorMsg}</div>}

        <button type="submit" className="login-btn">
          로그인
        </button>

        <div className="extra-link">
          <Link to="/findId">아이디 찾기</Link>
          <Link to="/findPwd">비밀번호 찾기</Link>
          <Link to="/register">회원가입</Link>
          {/* <Link to="/findPwd">비밀번호 찾기</Link>
          <Link to="/register">회원가입</Link> */}
        </div>
      </form>
    </LoginStyled>
  );
}

export default Login;
