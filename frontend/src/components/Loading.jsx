import React from "react";
import styled from "styled-components";
import { Spin } from "antd";

const LoadingStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background-color: #ffffffcc;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .ant-spin-dot-item {
    background-color: #9d141d;
  }

  .ant-spin-text {
    color: #9d141d;
  }
`;

function Loading({ loading }) {
  return (
    <>
      {loading && (
        <LoadingStyle>
          <Spin spinning={loading} tip="Loading..." />
        </LoadingStyle>
      )}
    </>
  );
}

export default Loading;
