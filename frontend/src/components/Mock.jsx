import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CommonTable from "./common/CommonTable";
import Loading from "./Loading";

const MockStyled = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;

  .half {
    flex: 1;
  }
`;

function Mock() {
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onGetMock();
    // setTableData([
    //   {
    //     idx: 1,
    //     id: "test",
    //     code: "032300",
    //     price: 56200,
    //     count: 150,
    //     date_insert: "2021-09-04T17:56:03",
    //     date_update: "2021-09-04T18:23:09.808",
    //     type: null,
    //     name: "한국파마",
    //   },
    //   {
    //     idx: 4,
    //     id: "test",
    //     code: "060240",
    //     price: 7260,
    //     count: 150,
    //     date_insert: "2021-09-05T13:01:06.822",
    //     date_update: "2021-09-05T13:01:06.822",
    //     type: null,
    //     name: "룽투코리아",
    //   },
    //   // { price: { closing_price: 20717000, current_price: 20009000 } },
    // ]);
  }, []);

  // 모의투자 잔고 조회
  const onGetMock = async () => {
    setLoading(true);

    await axios
      .post(`/api/mock/read`)
      .then((res) => {
        setLoading(false);
        setTableData(res.data);
      })
      .catch((error) => {
        console.log("onGetDart", error);
      });
  };

  const columns = [
    {
      title: "종목명",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center",
      render: (value, record) => {
        return value;
      },
    },
    {
      title: "수량",
      dataIndex: "count",
      key: "count",
      width: 200,
      align: "center",
      render: (value, record) => {
        return value;
      },
    },
    {
      title: "손익분기",
      dataIndex: "price",
      key: "price",
      width: 200,
      align: "center",
      render: (value, record) => {
        return value;
      },
    },
  ];

  return (
    <MockStyled>
      <Loading loading={loading} />
      {/* 주문 */}
      <div className="half">구매/판매</div>

      {/* 잔고 */}
      <div className="half">
        <CommonTable data={tableData} columns={columns} />
      </div>
    </MockStyled>
  );
}

export default Mock;
