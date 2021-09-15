import { InputNumber } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { store } from "../store";
import { selectStock } from "../store/actions";
import CommonSelect from "./common/CommonSelect";
import CommonTable from "./common/CommonTable";
import Loading from "./Loading";
import CommonInput from "./common/CommonInput";

const MockStyled = styled.div`
  width: 80%;
  margin: 0 auto;
  // display: flex;

  .mock-info {
    display: flex;
    padding-top: 30px;

    .mock-flex {
      flex: 1;
    }
  }

  .stock-name {
    font-size: 22px;
    font-weight: bold;
  }

  .mock-item {
    padding-bottom: 20px;

    .item-title {
      margin-bottom: 10px;
      font-weight: bold;
    }

    .mock-price {
      font-size: 30px;
      font-weight: bold;
    }

    input {
      height: 45px;
      font-size: 18px;
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

  const { errors, register, watch, handleSubmit } = useForm({ mode: "all" });
  const watchValues = watch();

  useEffect(() => {
    // onGetMock();
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
        console.log("onGetMock", error);
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
    setLoading(true);

    const params = {
      code: state.stock.code,
      price: parseInt(watchValues.orderPrice),
      count: parseInt(watchValues.orderCount),
    };

    await axios
      .post(`/api/mock/create`, params)
      .then((res) => {
        setLoading(false);
        // setDetailData(res.data?.info);
      })
      .catch((error) => {
        console.log("onBuyStock", error);
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
              <div className="mock-price">{detailData && detailData?.price}</div>
              <div>등락률</div>
            </div>
          </div>

          <div className="mock-flex">종목차트 영역</div>

          <div className="mock-flex">
            <form onSubmit={(e) => e.stopPropagation()} autoComplete="off">
              <div className="mock-item">
                <div className="item-title">금액</div>
                <CommonInput
                  name="orderPrice"
                  type="number"
                  register={register}
                  defaultValue={detailData?.price || 0}
                />
              </div>

              <div className="mock-item">
                <div className="item-title">수량</div>
                <CommonInput name="orderCount" type="number" register={register} defaultValue={1} />
              </div>

              {/* 구매/판매 버튼 */}
              <div className="mock-btns">
                <button className="burgundy-bg" onClick={handleSubmit(onBuyStock)}>
                  구매하기
                </button>
                <button className="dark-bg">판매하기</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 잔고 */}
      <div className="balance">
        <div className="mock-item">
          <div className="item-title">평가손익</div>
          <div>최근 일주일 잔고 그래프 영역</div>
          <CommonTable data={tableData} columns={columns} />
        </div>
      </div>
    </MockStyled>
  );
}

export default Mock;
