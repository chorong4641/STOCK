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
import { CalculatorOutlined, CaretDownFilled } from "@ant-design/icons";
import { Modal } from "antd";

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

  .group-text {
    font-size: 18px;
    font-weight: bold;

    .anticon {
      margin-left: 5px;
    }
  }

  .group-contents {
    padding: 10px 0;
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

const MockModalStyled = styled.div`
  .calc-btn {
    width: 100%;
    height: 40px;
    margin: 20px 0;
  }

  .avg-result {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 15px 0 5px;

    span {
      font-size: 18px;
      color: #9d141d;
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
  // 자산 그래프 데이터
  const [capitalData, setCapitalData] = useState(null);
  // 평단가 계산기 모달
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 계산한 평단가
  const [avgPrice, setAvgPrice] = useState({});

  const { register, watch, handleSubmit } = useForm({ mode: "all" });
  const { register: registerModal, watch: watchModal, handleSubmit: handleSubmitModal } = useForm({ mode: "all" });
  const watchValues = watch();
  const watchModalValues = watchModal();

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
          setCapitalData(data[data.length - 1]?.capital);
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

  // 평단가 계산하기 이벤트
  const onCalcPrice = () => {
    const intValues = {};
    // 폼 입력값이 string으로 처리되므로 int형으로 변경
    Object.keys(watchModalValues).forEach((key) => (intValues[key] = parseInt(watchModalValues[key])));
    const { originPrice, originCount, newPrice, newCount } = intValues;

    // 입력값이 있을 때만 계산 수행
    if (originPrice && originCount && newPrice && newCount) {
      const calcPrice = (originPrice * originCount + newPrice * newCount) / (originCount + newCount);
      setAvgPrice({ count: originCount + newCount, price: calcPrice.toFixed(2) });
    } else {
      setAvgPrice({ count: 0, price: 0 });
    }
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

          {/* <div className="mock-flex flex-2">
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
          </div> */}

          <div className="mock-flex">
            <div className="group-text">
              주식매매
              <CalculatorOutlined
                onClick={() => setIsModalVisible(true)}
                title="평단가 계산기"
                style={{ color: "#9d141d" }}
              />
            </div>

            <form className="group-contents" onSubmit={(e) => e.stopPropagation()} autoComplete="off">
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
              xaxis: { categories: capitalData ? Object.keys(capitalData).map((key) => key) : [] },
              yaxis: {
                labels: {
                  formatter: function (value) {
                    return addComma(value);
                  },
                },
              },
              colors: ["#3f4753"],
            }}
            series={[{ data: capitalData ? Object.keys(capitalData).map((key) => capitalData[key]) : [] }]}
            type="line"
            height={200}
          />
        </div>
        <CommonTable data={tableData} columns={columns} />
      </div>

      {isModalVisible && (
        <Modal
          title="평단가 계산기"
          visible={isModalVisible}
          onCancel={() => {
            setAvgPrice({});
            setIsModalVisible(false);
          }}
          footer={null}
          maskClosable={false}
        >
          <MockModalStyled>
            <form onSubmit={(e) => e.stopPropagation()} autoComplete="off">
              <div className="input-item">
                <div className="label">보유단가</div>
                <CommonInput name="originPrice" type="number" register={registerModal} placeholder={0} />
              </div>
              <div className="input-item">
                <div className="label">보유수량</div>
                <CommonInput name="originCount" type="number" register={registerModal} />
              </div>
              <div className="input-item">
                <div className="label">매수단가</div>
                <CommonInput name="newPrice" type="number" register={registerModal} />
              </div>
              <div className="input-item">
                <div className="label">매수수량</div>
                <CommonInput name="newCount" type="number" register={registerModal} />
              </div>
            </form>
            <button className="dark-bg calc-btn" onClick={() => handleSubmitModal(onCalcPrice())}>
              계산하기
            </button>

            {/* 평단가 계산 결과 */}
            {!!avgPrice?.count && (
              <>
                {/* 결과 화살표 */}
                <CaretDownFilled
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "16px",
                  }}
                />

                <div className="avg-result">
                  <div>
                    총 보유수량: <span>{addComma(avgPrice.count)}개</span>
                  </div>
                  <div>
                    평단가: <span>{addComma(avgPrice.price)}원</span>
                  </div>
                </div>
              </>
            )}
          </MockModalStyled>
        </Modal>
      )}
    </MockStyled>
  );
}

export default Mock;
