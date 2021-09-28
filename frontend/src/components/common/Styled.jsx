import styled from "styled-components";

// 로그인, 회원가입, 아이디찾기, 비밀번호찾기 레이아웃
export const LayoutStyled = styled.div`
  width: 80%;
  height: 100%;
  margin: 0 auto;
  padding: 30px 0;

  form {
    position: relative;
    width: 500px;
    height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    top: -10%;

    .page-title {
      margin-bottom: 30px;
      font-size: 20px;
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

    button {
      height: 40px;
      margin-top: 40px;
      padding: 0 15px;
      color: #fff;
      background-color: #9d141d;
    }

    .find-result {
      padding: 20px 0;
      text-align: center;

      .find-text {
        padding: 30px 0;
        font-size: 18px;
      }
    }
  }
`;
