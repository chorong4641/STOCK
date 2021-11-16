import React from "react";
import styled from "styled-components";

const RecommendStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;
`;

function Recommend() {
  return <RecommendStyled>종목추천</RecommendStyled>;
}

export default Recommend;
