import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Chart from "react-apexcharts";
import { store } from "../store";
import { selectStock } from "../store/actions";
import CommonSelect from "./common/CommonSelect";
import CommonTable from "./common/CommonTable";
import Loading from "./Loading";
import CommonInput from "./common/CommonInput";
import { addComma } from "./common/CommonFunctions";

const MockStyled = styled.div`
  width: 80%;
  margin: 0 auto;
  // display: flex;

  .mock-info {
    display: flex;
    padding-top: 30px;

    .mock-flex {
      min-width: 200px;
      flex: 1;

      &.flex-2 {
        flex: 2;
      }

      &:nth-child(2n) {
        margin: 0 50px;
      }
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

    .total-price {
      font-weight: bold;

      .price-text {
        font-size: 18px;
        margin-right: 20px;
      }

      .price-number {
        font-size: 24px;
      }
    }
  }
`;

function Mock() {
  const [state, dispatch] = useContext(store);
  const [tableData, setTableData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  // 총 자산
  const [totalPrice, setTotalPrice] = useState(0);

  const { errors, register, watch, handleSubmit } = useForm({ mode: "all" });
  const watchValues = watch();

  useEffect(() => {
    onGetMock();
  }, []);

  // 모의투자 잔고 조회
  const onGetMock = async () => {
    setLoading(true);
    await dispatch(selectStock(null));

    await axios
      .post(`/api/mock/read`)
      .then((res) => {
        setLoading(false);
        if (res.data) {
          const { data } = res;
          // 종목별 잔고 테이블 데이터
          const tableData = data.splice(0, data.length - 1);
          setTableData(tableData);
          // 총 자산
          const price = data[data.length - 1]?.price;
          setTotalPrice(addComma(price));
        }
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
      .post(`/api/mock/insert`, params)
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
        return addComma(value);
      },
    },
    {
      title: "손익분기",
      dataIndex: "price",
      key: "price",
      width: 200,
      align: "center",
      render: (value, record) => {
        return addComma(value);
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

          <div className="mock-flex flex-2">
            종목차트 영역
            <Chart
              className="detail-chart-graph"
              // options={data[period]?.line?.options}
              // series={[data[period]?.line?.series]}
              options={{
                chart: {
                  // zoom: {
                  //   enabled: false,
                  // },
                },
                xaxis: { categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997] },
              }}
              series={[{ data: [30, 40, 45, 50, 49, 60, 70] }]}
              type="line"
              height={200}
            />
          </div>

          <div className="mock-flex flex-2">
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
        <div className="total-price">
          <span className="price-text">총 자산</span>
          <span className="price-number">{totalPrice}</span>
        </div>
        <div>
          최근 일주일 잔고 그래프(데이터 변경 필요)
          <Chart
            className="detail-chart-graph"
            // options={data[period]?.line?.options}
            // series={[data[period]?.line?.series]}
            options={{
              chart: {
                zoom: {
                  enabled: false,
                },
              },
              xaxis: { categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997] },
            }}
            series={[{ data: [30, 40, 45, 50, 49, 60, 70] }]}
            type="line"
            height={200}
          />
        </div>
        <CommonTable data={tableData} columns={columns} />
      </div>
    </MockStyled>
  );
}

export default Mock;
