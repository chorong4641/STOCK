import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Table } from "antd";
import Loading from "../Loading";
import { store } from "../../store";
import axios from "axios";

const DetailNewsStyled = styled.div`
  //
`;

function DetailNews() {
  const [state, dispatch] = useContext(store);
  // 종목 뉴스 정보
  const [newsData, setNewsData] = useState([]);
  // 로딩
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onGetDetailNews();
  }, [state.stock?.code]);

  // 종목 뉴스 조회
  const onGetDetailNews = async () => {
    setLoading(true);
    await axios
      .get(`/api/searchnews/${state.stock?.name}`)
      .then((res) => {
        setNewsData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetDetailNews", error);
      });
  };

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
    {
      title: "발행일",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
  ];

  return (
    <DetailNewsStyled>
      <Loading loading={loading} />

      <Table
        dataSource={newsData}
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
