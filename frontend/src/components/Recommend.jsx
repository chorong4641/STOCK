import React from "react";
import styled from "styled-components";

const RecommendStyled = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;
`;
function Recommend(props) {
  return <RecommendStyled>추천종목</RecommendStyled>;
}

export default Recommend;
