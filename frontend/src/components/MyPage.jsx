import React from "react";
import styled from "styled-components";

const MyPageStyled = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;
`;
function MyPage(props) {
  return <MyPageStyled>마이페이지</MyPageStyled>;
}

export default MyPage;
