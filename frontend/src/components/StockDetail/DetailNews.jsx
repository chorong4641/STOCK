import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "antd";

const DetailNewsStyled = styled.div`
  //
`;

function DetailNews({ newsInfo }) {
  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "언론사",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "날짜",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <DetailNewsStyled>
      <Table
        dataSource={newsInfo}
        columns={columns}
        size="small"
        // expandable={{
        //   expandedRowRender: (record) => {
        //     return <p style={{ margin: 0 }}>{record.href}</p>;
        //   },
        // }}
        pagination={false}
      />
    </DetailNewsStyled>
  );
}

export default DetailNews;
