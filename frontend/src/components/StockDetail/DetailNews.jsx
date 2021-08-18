import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "antd";
import Loading from "../Loading";

const DetailNewsStyled = styled.div`
  //
`;

function DetailNews({ newsInfo, loading }) {

  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (value, record) => {
        return (
          <a href={record.href} target="_blank" rel="noreferrer" style={{ textAlign: "left" }}>
            {value}
          </a>
        );
      },
    },
    {
      title: "언론사",
      dataIndex: "source",
      key: "source",
      align: "center",
    },
    // {
    //   title: "발행시간",
    //   dataIndex: "time",
    //   key: "time",
    // },
  ];

  return (
    <DetailNewsStyled>
      <Loading loading={loading} />

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
