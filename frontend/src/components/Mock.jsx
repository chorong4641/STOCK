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
import { CalculatorOutlined, CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { validRange } from "../utils/validation";
import ErrorList from "antd/lib/form/ErrorList";

const MockStyled = styled.div`
  width: 70%;
  margin: 0 auto;
  // display: flex;

  .mock-info {
    display: flex;
    padding-top: 30px;

    .mock-flex {
      min-width: 200px;
      flex: 1;
      margin: auto 50px;
    }
  }

  .group-text {
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;

    .anticon {
      margin-left: 5px;
    }
  }

  .group-contents {
    // padding-top: 10px;
  }

  .stock-name {
    margin-right: 10px;
    font-size: 23px;
    font-weight: bold;
  }

  .mock-item {
    padding-bottom: 20px;
    text-align: center;

    .item-title {
      margin-bottom: 10px;
      font-weight: bold;
      text-align: left;
    }
  }

  .vertical-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stock-price {
    font-size: 28px;
    font-weight: bold;
  }

  .stock-price-detail {
    width: 60%;
    margin: 30px auto 0;
    font-weight: bold;
    color: #444;

    div {
      display: flex;
      justify-content: space-between;
      font-size: 16px;

      span {
        width: 100px;
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

  .capital {
    margin: 65px 0 30px;

    .total-price {
      margin-left: 18px;
      font-weight: bold;

      .price-text {
        font-size: 18px;
        margin-right: 20px;
      }

      .price-number {
        font-size: 24px;
      }
    }

    .capital-chart {
      margin: 10px 0 20px;
    }
  }
`;

// 태그 스타일
const TagStyled = styled.span`
  border: 1px solid;
  border-radius: 3px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => props.textColor || "#000"};
  background-color: ${(props) => props.bgColor || "#fff"};
  cursor: default;
`;

// 평단가 계산기 모달 스타일
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

  const { register, watch, handleSubmit, errors } = useForm({ mode: "all" });
  const { register: registerModal, watch: watchModal, handleSubmit: handleSubmitModal } = useForm({ mode: "all" });
  const watchValues = watch();
  const watchModalValues = watchModal();

  useEffect(() => {
    onGetMock();
    // 총 자산
    // const price = 20481800;
    // setTotalPrice(addComma(price));
    // setCapitalData(0);
    // setTableData([
    //   {
    //     closing: 67000,
    //     code: "032300",
    //     high: 71100,
    //     low: 65700,
    //     name: "한국파마",
    //     opening: 66900,
    //     price: 56256,
    //     count: 146,
    //     time: 1559,
    //     trading_volume: 977412,
    //     warning: "1",
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
    //     closing: 6760,
    //     dtd: 640,
    //     rating: 9.47,
    //   },
    //   {
    //     idx: 5,
    //     id: "test",
    //     code: "066570",
    //     price: 53000,
    //     count: 2,
    //     date_insert: "2021-09-15T16:47:40.401",
    //     date_update: "2021-09-15T16:47:40.401",
    //     type: null,
    //     name: "LG전자",
    //     closing: 141000,
    //     dtd: -1500,
    //     rating: -1.06,
    //   },
    //   // { price: 20481800 },
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
    // setDetailData({
    //   code: "A032300",
    //   name: "한국파마",
    //   price: 62700,
    //   closing: 65700,
    //   opening: 64000,
    //   high: 65300,
    //   low: 61200,
    //   time: 1559,
    //   trading_volume: 453747,
    //   warning: "1",
    // });

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

  // 구매/판매 이벤트
  const onBuySellStock = async (type) => {
    if (!state.stock?.code || errors?.orderCount || errors?.orderPrice) return;
    setLoading(true);

    const params = {
      code: state.stock.code,
      price: parseInt(watchValues.orderPrice),
      count: type === "buy" ? parseInt(watchValues.orderCount) : parseInt(-watchValues.orderCount),
    };

    await axios
      .post(`/api/mock/insert`, params)
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        // setDetailData(res.data?.info);
      })
      .catch((error) => {
        console.log("onBuySellStock", error);
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
      setAvgPrice({ count: originCount + newCount, price: Math.round(calcPrice) });
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

  // 투자 경고 구분
  let warningInfo = { text: "", textColor: "", bgColor: "" };
  if (detailData) {
    const { warning } = detailData;
    if (warning === "1") {
      warningInfo = { text: "정상", textColor: "#fff", bgColor: "#14950c" };
    } else if (warning === "2") {
      warningInfo = { text: "주의", textColor: "#fff", bgColor: "#eacd02" };
    } else if (warning === "3") {
      warningInfo = { text: "경고", textColor: "#fff", bgColor: "#e66528" };
    } else if (warning === "4") {
      warningInfo = { text: "위험예고", textColor: "#fff", bgColor: "#ec1967" };
    } else if (warning === "5") {
      warningInfo = { text: "위험", textColor: "#fff", bgColor: "#ec2c19" };
    }
  }

  // 매수/매도 최대 수량
  let stockMaxCount = 1;
  if (tableData && state.stock?.code) {
    tableData.forEach((value) => {
      // 잔고 종목 코드와 검색 종목 코드가 같을 시
      if (value.code === state.stock?.code) {
        // 해당 종목의 잔고 수량을 넣어줌
        stockMaxCount = value.count;
      }
    });
  }

  // 전일대비 비교 값
  let compare = { color: "", icon: null, value: 0, rate: "0.00%" };
  if (detailData) {
    const { closing, price } = detailData;
    // 등락률
    const rate = (((price - closing) / closing) * 100).toFixed(2);

    if (closing > price) {
      compare = { color: "blue", icon: <CaretDownFilled />, value: closing - price, rate: `${rate}%` };
    } else if (closing < price) {
      compare = { color: "red", icon: <CaretUpFilled />, value: price - closing, rate: `${rate}%` };
    }
  }

  return (
    <MockStyled>
      <Loading loading={loading} />
      <div className="half">
        {/* 종목명 검색 */}
        <CommonSelect placeholder="종목명 검색" onAfterSelect={(value) => onGetStockDetail(value)} />
      </div>

      {state.stock?.code && detailData && (
        <div className="mock-info">
          <div className="mock-flex">
            <div className="group-contents">
              <div className="vertical-center">
                <span className="stock-name">{detailData?.name}</span>
                <Tooltip placement="right" title={`투자 경고 구분: ${warningInfo.text}`}>
                  <TagStyled textColor={warningInfo.textColor} bgColor={warningInfo.bgColor}>
                    {warningInfo.text}
                  </TagStyled>
                </Tooltip>
              </div>
              <div style={{ color: compare.color, textAlign: "center" }}>
                <div className="stock-price">{addComma(detailData?.price)}원</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {compare.icon}
                  {`${addComma(compare.value)} (${compare.rate})`}
                </div>
              </div>
              <div className="stock-price-detail">
                <div>
                  <span>시가</span>
                  {addComma(detailData.opening)}원
                </div>
                <div>
                  <span>고가</span>
                  {addComma(detailData.high)}원
                </div>
                <div>
                  <span>저가</span>
                  {addComma(detailData.low)}원
                </div>
                <div>
                  <span>종가</span>
                  {addComma(detailData.closing)}원
                </div>
              </div>
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
              <Tooltip placement="right" title="평단가 계산기">
                <CalculatorOutlined onClick={() => setIsModalVisible(true)} style={{ color: "#9d141d" }} />
              </Tooltip>
            </div>

            <form className="group-contents" onSubmit={(e) => e.preventDefault()} autoComplete="off">
              <div className="mock-item">
                <div className="item-title">금액</div>
                <CommonInput
                  name="orderPrice"
                  type="number"
                  register={register}
                  defaultValue={detailData?.price || 0}
                  error={errors.orderPrice}
                  validation={{
                    validate: { range: (value) => validRange(value, detailData?.price) },
                  }}
                />
              </div>

              <div className="mock-item">
                <div className="item-title">수량</div>
                <CommonInput
                  name="orderCount"
                  type="number"
                  register={register}
                  defaultValue={1}
                  error={errors.orderCount}
                  validation={{
                    validate: { range: (value) => validRange(value, 1, stockMaxCount) },
                  }}
                />
              </div>

              {/* 구매/판매 버튼 */}
              <div className="mock-btns">
                <button className="burgundy-bg" onClick={() => onBuySellStock("buy")}>
                  구매하기
                </button>
                <button className="dark-bg" onClick={() => onBuySellStock("sell")}>
                  판매하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 잔고 */}
      <div className="capital">
        {/* <div className="group-text">자산정보</div> */}
        <div className="total-price">
          <span className="price-text">총 자산</span>
          <span className="price-number">{totalPrice}</span>
        </div>
        <div className="capital-chart">
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
                <CommonInput name="originPrice" type="number" register={registerModal} style={{ height: "40px" }} />
              </div>
              <div className="input-item">
                <div className="label">보유수량</div>
                <CommonInput name="originCount" type="number" register={registerModal} style={{ height: "40px" }} />
              </div>
              <div className="input-item">
                <div className="label">매수단가</div>
                <CommonInput name="newPrice" type="number" register={registerModal} style={{ height: "40px" }} />
              </div>
              <div className="input-item">
                <div className="label">매수수량</div>
                <CommonInput name="newCount" type="number" register={registerModal} style={{ height: "40px" }} />
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
