import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Chart from "react-apexcharts";
import { Popover } from "antd";
import { CaretDownFilled, CaretUpFilled, PlusSquareFilled } from "@ant-design/icons";
import { NavLink, Redirect, Route, useRouteMatch } from "react-router-dom";
import { store } from "../store";
import Loading from "./Loading";
import DetailNews from "./StockDetail/DetailNews";
import DetailBoard from "./StockDetail/DetailBoard";
import { addComma } from "./common/CommonFunctions";
import { getBookmark } from "../store/actions";
import DetailInvestor from "./StockDetail/DetailInvestor";
import DetailFinancial from "./StockDetail/DetailFinancial";

const DetailStyled = styled.div`
  .detail-top {
    display: flex;
    justify-content: space-between;
    height: 350px;
    padding: 20px 30px;
    background-color: #fbfbfb;
    border-radius: 5px;

    .detail-info {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 25%;
      min-width: 150px;
      margin-right: 50px;

      .stock-item {
        text-align: center;

        .stock-name {
          font-size: 20px;
          font-weight: 700;

          .anticon-heart {
            margin-right: 5px;
            cursor: pointer;
          }
        }

        .stock-code {
          font-size: 14px;
        }

        .stock-price {
          font-size: 28px;
          font-weight: 700;
          margin: 10px 0 20px;
          padding: 10px;
          background-color: #3f47530d;
          border-radius: 5px;
        }

        .compare {
          font-weight: 500;
          font-size: 18px;

          .compare-extra {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 5px;

            .compare-text {
              position: relative;
              top: 1px;
              margin-right: 10px;
              font-size: 13px;
            }
          }
        }

        table {
          width: 100%;
          font-weight: 700;
          text-align: left;
          justify-content: space-between;

          td {
            padding: 2px 5px;
            color: #3f4753;

            &.value {
              text-align: right;
            }
          }
        }
      }
    }

    .detail-chart {
      width: 75%;
      display: flex;
      flex-direction: column;

      .btn-area {
        display: flex;
        margin: 10px;

        .left-btns {
          padding-right: 15px;
          border-right: 1px solid #ddd;
        }

        .right-btns {
          padding-left: 10px;
        }

        button {
          margin-left: 5px;
          padding: 2px 10px;
          font-size: 13px;
          font-weight: 700;

          &.active {
            color: #fff;
            background-color: #3f4753;
          }
        }
      }
    }
  }

  .detail-bottom {
    margin: 50px 0 30px;

    .detail-nav {
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: #fbfbfb;
      font-weight: bold;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;

      a {
        height: inherit;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 0 10px;
        color: #3f4753;
        border-right: 1px solid #ddd;

        &.active {
          color: #fff !important;
          background-color: #3f4753;
        }

        &:last-child {
          border-right: 0;
        }
      }
    }

    .detail-contents {
      padding: 10px 0;
    }
  }
`;

const PopoverStyled = styled.div`
  min-width: 140px;

  .bookmark-list {
    min-height: 100px;

    .bookmark-list-item {
      padding: 3px;
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
      }

      &.active {
        font-weight: bold;
        background-color: #f5f5f5;
      }
    }
  }

  .bookmark-footer {
    padding-top: 12px;
    font-size: 13px;
    text-align: center;
    border-top: 1px solid #f0f0f0;

    button {
      color: #fff;
      font-size: 12px;
      background-color: #3f4753;
    }
  }
`;

function StockDetail() {
  const { path } = useRouteMatch();
  const [state, dispatch] = useContext(store);
  // 차트 기간 선택값
  const [period, setPeriod] = useState("week");
  // 검색한 종목의 상세정보, 기간 차트정보
  const [data, setData] = useState({});
  // 로딩
  const [loading, setLoading] = useState(false);
  // 선택한 관심그룹번호
  const [selectGroupIdx, setSelectGroupIdx] = useState(0);
  // 팝오버 열기/닫기
  const [visible, setVisible] = useState(false);
  // 차트 종류(봉차트, 선차트)
  const [chartType, setChartType] = useState("candlestick");

  useEffect(() => {
    // 종목 상세 정보 조회
    onGetStockDetail(state.stock?.code);
  }, [state.stock?.code]);

  useEffect(() => {
    // 1분마다 주가 갱신
    setInterval(() => {
      if (data && data.info) onGetRealTimeStock();
    }, 60000);
  }, [data.info]);

  // 종목 상세 정보 조회
  const onGetStockDetail = async (code) => {
    if (!code) return;

    setLoading(true);
    await axios
      .get(`/api/getstock/${code}`)
      .then((res) => {
        const detailChartData = { line: {}, candlestick: {} };
        if (Object.keys(res.data).length > 0) {
          Object.keys(res.data).forEach((key) => {
            if (key === "info") return;
            const lineData = { x: [], y: [] };
            const candlestickData = [];
            res.data[key].forEach((value) => {
              const { date, opening, high, low, closing } = value;
              lineData.x.push(date.toString());
              lineData.y.push(closing);
              candlestickData.push({
                x: date.toString(),
                y: [opening, high, low, closing],
              });
            });

            detailChartData.line[key] = {
              series: {
                name: "price",
                data: lineData.y,
              },
              options: {
                chart: {
                  id: key,
                  type: "line",
                  // zoom: {
                  //   enabled: false,
                  // },
                },
                xaxis: {
                  categories: lineData.x,
                  tooltip: {
                    enabled: false,
                  },
                  labels: { rotate: 0 },
                  tickAmount: 5,
                },
                yaxis: {
                  labels: {
                    formatter: function (value) {
                      return addComma(value);
                    },
                  },
                },
                stroke: {
                  curve: "straight",
                },
                colors: ["#3f4753"],
              },
            };

            detailChartData.candlestick[key] = {
              series: [{ data: candlestickData }],
              options: {
                chart: {
                  type: "candlestick",
                  // height: 300,
                  // zoom: {
                  //   enabled: false,
                  // },
                },
                plotOptions: {
                  candlestick: {
                    colors: {
                      upward: "#d23a3a",
                      downward: "#3a77d2",
                    },
                  },
                },
                xaxis: {
                  labels: {
                    formatter: function (value) {
                      if (!value) return;
                      const date = value;
                      return date;
                    },
                    rotate: 0,
                  },
                  tooltip: {
                    enabled: false,
                  },
                  tickAmount: 5,
                },
                yaxis: {
                  labels: {
                    formatter: function (value) {
                      return addComma(value);
                    },
                  },
                },
                tooltip: {
                  custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    const [opening, high, low, closing] = w.config.series[0].data[dataPointIndex].y;
                    return `<div class="custom-tooltip">
                      <div><span class="bold">${w.config.series[0].data[dataPointIndex].x}</span></div>
                      <div><span>시가</span>: <span class="bold">${addComma(opening)}</span></div>
                      <div><span>고가</span>: <span class="bold">${addComma(high)}</span></div>
                      <div><span>저가</span>: <span class="bold">${addComma(low)}</span></div>
                      <div><span>종가</span>: <span class="bold">${addComma(closing)}</span></div>
                      </div>`;
                  },
                },
              },
            };
          });
        }

        setData({
          info: res.data.info[0],
          week: { line: detailChartData.line["week"], candlestick: detailChartData.candlestick["week"] },
          month: { line: detailChartData.line["month"], candlestick: detailChartData.candlestick["month"] },
          year: { line: detailChartData.line["year"], candlestick: detailChartData.candlestick["year"] },
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetStockDetail", error);
      });
  };

  // 실시간 주가 조회
  const onGetRealTimeStock = async () => {
    setLoading(true);
    await axios
      .get(`/api/chart/time/${state.stock?.code}`)
      .then((res) => {
        //
      })
      .catch((error) => {
        console.log("onGetRealTimeStock", error);
      });
  };

  // 관심그룹 및 종목 조회
  const onGetBookmark = async () => {
    await axios
      .get("/api/bookmark/read")
      .then((res) => {
        dispatch(getBookmark(res.data));
      })
      .catch((error) => {
        console.log("onGetBookmark", error);
      });
  };

  // 관심종목 추가
  const onAddBookmark = async () => {
    await axios
      .get(`/api/bookmark/stock_create/${selectGroupIdx}/${state.stock?.code}`)
      .then((res) => {
        setVisible(false);
      })
      .catch((error) => {
        console.log("onAddBookmark", error);
      });
  };

  // 전일대비 비교 값
  let compare = { status: "same", icon: null, value: 0, rate: "0.00%" };
  if (data?.info) {
    const { closing, price } = data.info;
    // 등락률
    const rate = (((price - closing) / closing) * 100).toFixed(2);

    if (closing > price) {
      compare = { status: "down", icon: <CaretDownFilled />, value: closing - price, rate: `${rate}%` };
    } else if (closing < price) {
      compare = { status: "up", icon: <CaretUpFilled />, value: price - closing, rate: `${rate}%` };
    }
  }

  // 하단 탭 메뉴
  const bottomMenu = [
    {
      name: "종목뉴스",
      path: "/news",
    },
    {
      name: "투자자별 매매동향",
      path: "/investor",
    },
    {
      name: "종목토론",
      path: "/board",
    },
    {
      name: "재무제표",
      path: "/finance",
    },
    {
      name: "전자공시",
      path: "/dart",
    },
  ];

  return (
    <DetailStyled>
      <Loading loading={loading} />

      {/* 상단 종목 정보 영역(현재가, 차트 등) */}
      <div className="detail-top">
        <div className="detail-info">
          <div className="stock-item">
            <span className="stock-name">
              {state.user && (
                <Popover
                  title="종목그룹 선택"
                  placement="bottomLeft"
                  overlayClassName="common-popover"
                  content={
                    <PopoverStyled>
                      <div className="bookmark-list">
                        {state.bookmark?.map((data) => {
                          return (
                            <div
                              className={`bookmark-list-item${selectGroupIdx === data.idx ? " active" : ""}`}
                              onClick={() => setSelectGroupIdx(data.idx)}
                            >
                              {data.name}
                            </div>
                          );
                        })}
                      </div>
                      <div className="bookmark-footer">
                        <button className={!selectGroupIdx ? "disabled" : ""} onClick={onAddBookmark}>
                          확인
                        </button>
                      </div>
                    </PopoverStyled>
                  }
                  trigger="click"
                  arrowPointAtCenter
                  visible={visible}
                  onVisibleChange={(visible) => setVisible(visible)}
                >
                  <PlusSquareFilled
                    title="관심종목에 추가"
                    style={{ marginRight: "5px", color: "#3f4753" }}
                    onClick={onGetBookmark}
                  />
                </Popover>
              )}
              {data.info?.name}
            </span>
            <span className="stock-code">{` (${data.info?.code})`}</span>
          </div>
          <div className="stock-item">
            <div
              className={`stock-price ${compare.status === "up" ? "red" : ""}${
                compare.status === "down" ? "blue" : ""
              }`}
            >
              <div>{addComma(data.info?.price)}</div>
              <div className="compare">
                <div className="compare-extra">
                  <div className="compare-text">{`어제보다 `} </div>
                  <div>
                    {compare.icon}
                    {`${addComma(compare.value)} (${compare.rate})`}
                  </div>
                </div>
              </div>
            </div>

            <table>
              <tbody>
                <tr>
                  <td>전일</td>
                  <td className="value">{addComma(data.info?.closing)}</td>
                </tr>
                <tr>
                  <td>시가</td>
                  <td className="value">{addComma(data.info?.opening)}</td>
                </tr>
                <tr>
                  <td>고가</td>
                  <td className="value">{addComma(data.info?.high)}</td>
                </tr>
                <tr>
                  <td>저가</td>
                  <td className="value">{addComma(data.info?.low)}</td>
                </tr>
                <tr>
                  <td>거래량</td>
                  <td className="value">{addComma(data.info?.trading_volume)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="detail-chart">
          <div className="btn-area">
            <div className="left-btns">
              <button
                onClick={() => setChartType("candlestick")}
                className={`${chartType === "candlestick" ? "active" : ""}`}
              >
                봉차트
              </button>
              <button onClick={() => setChartType("line")} className={`${chartType === "line" ? "active" : ""}`}>
                선차트
              </button>
            </div>
            <div className="right-btns">
              <button onClick={() => setPeriod("week")} className={`period-btn ${period === "week" ? "active" : ""}`}>
                일
              </button>
              <button onClick={() => setPeriod("month")} className={`period-btn ${period === "month" ? "active" : ""}`}>
                월
              </button>
              <button onClick={() => setPeriod("year")} className={`period-btn ${period === "year" ? "active" : ""}`}>
                년
              </button>
            </div>
          </div>

          {/* 선차트 */}
          {data && data[period] && chartType === "line" && (
            <Chart
              className="detail-chart-graph"
              options={data[period]?.line?.options}
              series={[data[period]?.line?.series]}
              type="line"
              height={280}
            />
          )}
          {/* 봉차트 */}
          {data && data[period] && chartType === "candlestick" && (
            <Chart
              series={data[period]?.candlestick?.series}
              options={data[period]?.candlestick?.options}
              type="candlestick"
              height={280}
            />
          )}
        </div>
      </div>

      <div className="detail-bottom">
        <div className="detail-nav">
          {bottomMenu.map((menu) => {
            return (
              <NavLink to={`${path}/${state.stock?.code}${menu.path}`} activeClassName="active">
                {menu.name}
              </NavLink>
            );
          })}
        </div>

        <div className="detail-contents">
          <Route
            exact
            path={`${path}/${state.stock?.code}`}
            render={() => <Redirect to={`${path}/${state.stock?.code}/news`} />}
          />
          <Route path={`${path}/${state.stock?.code}/news`} render={() => data && data?.info && <DetailNews />} />
          <Route
            path={`${path}/${state.stock?.code}/finance`}
            render={() => data && data?.info && <DetailFinancial />}
          />
          <Route path={`${path}/${state.stock?.code}/board`} render={() => data && data?.info && <DetailBoard />} />
          <Route
            path={`${path}/${state.stock?.code}/investor`}
            render={() => data && data?.info && <DetailInvestor />}
          />
        </div>
      </div>
    </DetailStyled>
  );
}

export default StockDetail;
