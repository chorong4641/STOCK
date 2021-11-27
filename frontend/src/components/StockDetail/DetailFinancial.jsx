import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { store } from "../../store";
import CommonTable from "../common/CommonTable";
import Loading from "../Loading";

function DetailFinancial() {
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    onGetFinancial();
  }, [state.stock?.code]);

  // 재무제표 조회
  const onGetFinancial = async () => {
    setLoading(true);

    await axios
      .get(`/api/financial/${state.stock?.code}`)
      .then((res) => {
        setLoading(false);
        setTableData(res.data);
      })
      .catch((error) => {
        console.log("onGetFinancial", error);
      });
  };

  const year = new Date().getFullYear();
  const columns = [
    {
      title: "재무정보",
      dataIndex: "key",
      key: "key",
      render: (value, record) => {
        let unit = "";
        if (value === "PER" || value === "PBR") {
          unit = "배";
        } else if (value === "ROE") {
          unit = "%";
        } else if (
          value === "EPS" ||
          value === "영업이익" ||
          value === "당기순이익" ||
          value === "자산총계" ||
          value === "부채총계" ||
          value === "자본총계"
        ) {
          unit = "원";
        }
        return `${value}${unit ? `(${unit})` : ""}`;
      },
    },
    {
      title: year - 2,
      dataIndex: year - 2,
      key: year - 2,
      align: "right",
      render: (value, record) => {
        return `${value}원`;
      },
    },
    {
      title: year - 1,
      dataIndex: year - 1,
      key: year - 1,
      align: "right",
      render: (value, record) => {
        return `${value}원`;
      },
    },
    {
      title: year,
      dataIndex: year,
      key: year,
      align: "right",
      render: (value, record) => {
        return `${value}원`;
      },
    },
  ];

  return (
    <div>
      <Loading loading={loading} />

      <CommonTable data={tableData} columns={columns} pagination={false} />
    </div>
  );
}

export default DetailFinancial;
