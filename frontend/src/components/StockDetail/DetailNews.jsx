import React, { useContext, useEffect, useState } from "react";
import Loading from "../Loading";
import { store } from "../../store";
import axios from "axios";
import CommonTable from "../common/CommonTable";

function DetailNews() {
  const [state, dispatch] = useContext(store);
  // 종목 뉴스 정보
  const [tableData, setTableData] = useState([]);
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
        setTableData(res.data);
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
    <div>
      <Loading loading={loading} />

      <CommonTable data={tableData} columns={columns} />
    </div>
  );
}

export default DetailNews;
