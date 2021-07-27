import React from "react";
import styled from "styled-components";

const MyStockStyled = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;
`;
function MyStock(props) {
  return <MyStockStyled>관심종목</MyStockStyled>;
}

export default MyStock;
