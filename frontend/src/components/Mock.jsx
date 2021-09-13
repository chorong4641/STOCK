import { InputNumber } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { store } from "../store";
import { selectStock } from "../store/actions";
import CommonSelect from "./common/CommonSelect";
import CommonTable from "./common/CommonTable";
import Loading from "./Loading";

const MockStyled = styled.div`
  width: 80%;
  margin: 0 auto;
  // display: flex;

  .mock-info {
    display: flex;

    .mock-flex {
      flex: 1;
    }
  }

  .stock-name {
    padding-top: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .mock-item {
    padding: 20px 0;

    .item-title {
      margin-bottom: 10px;
      font-weight: bold;
    }

    .mock-input {
      height: 45px;
      background-color: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 2px;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  .mock-btns {
    display: flex;

    button {
      height: 45px;
      flex: 1;
      margin-right: 5px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .balance {
    margin: 50px 0;
  }
`;

function Mock() {
  const [state, dispatch] = useContext(store);
  const [tableData, setTableData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

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
    await dispatch(selectStock(null));

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

  // 종목 상세 정보 조회
  const onGetStockDetail = async (code) => {
    if (!code || loading) return;

    setLoading(true);
    await axios
      .get(`/api/getstock/${code}`)
      .then((res) => {
        setLoading(false);
        setDetailData(res.data?.info[0]);
      })
      .catch((error) => {
        console.log("onGetStockDetail", error);
      });
  };

  // 구매하기
  const onBuyStock = async () => {
    if (!state.stock?.code) return;

    // setLoading(true);

    // const params = {
    //   code:state.stock.code,
    //   price:detailData.price,
    //   count:
    // }
    // await axios
    //   .post(`/api/mock/create`, params)
    //   .then((res) => {
    //     setLoading(false);
    //     setDetailData(res.data?.info);
    //   })
    //   .catch((error) => {
    //     console.log("onBuyStock", error);
    //   });
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
      title: "구매금액",
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

      <div className="half">
        {/* 종목명 검색 */}
        <CommonSelect placeholder="종목명 검색" onAfterSelect={(value) => onGetStockDetail(value)} />
      </div>

      {state.stock?.code && (
        <div className="mock-info">
          <div className="mock-flex">
            <div className="mock-item">
              <div className="stock-name">{state.stock?.name}</div>
            </div>

            <div className="mock-item">
              <div className="item-title">{detailData && detailData?.price}</div>
            </div>
          </div>

          <div className="mock-flex">
            <div className="mock-item">
              <div className="item-title">금액</div>
              <input
                className="mock-input"
                type="number"
                defaultValue={detailData?.price || 0}
                onChange={(e) => console.log(e.target.value)}
              />
            </div>

            <div className="mock-item">
              <div className="item-title">수량</div>
              <input
                className="mock-input"
                type="number"
                defaultValue={1}
                onChange={(e) => console.log(e.target.value)}
              />
            </div>

            {/* 구매/판매 버튼 */}
            <div className="mock-btns">
              <button className="burgundy-bg">구매하기</button>
              <button className="dark-bg">판매하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 잔고 */}
      <div className="balance">
        <div className="mock-item">
          <div className="item-title">평가손익</div>
          <CommonTable data={tableData} columns={columns} />
        </div>
      </div>
    </MockStyled>
  );
}

export default Mock;
