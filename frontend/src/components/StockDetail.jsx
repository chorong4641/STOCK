import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Chart from "react-apexcharts";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { NavLink, Redirect, Route, Router, Switch, useLocation, useRouteMatch } from "react-router-dom";
import Loading from "./Loading";
import DetailNews from "./StockDetail/DetailNews";
import { store } from "../store";

const DetailStyled = styled.div`
  .detail-top {
    display: flex;
    justify-content: space-between;
    height: 300px;
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
              font-size: 13px;
            }

            div {
              margin: 0 8px;
            }
          }
        }

        .red {
          color: #ff0000;
        }

        .blue {
          color: #004eff;
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

      .period-btns {
        text-align: right;
        padding-right: 10px;

        .period-btn {
          margin-left: 5px;
          padding: 2px 10px;
          font-size: 13px;
          font-weight: 700;
          background-color: #3f47530d;
          border: none;
          border-radius: 3px;
          cursor: pointer;

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
          color: #fff;
          background-color: #3f4753;
        }

        &:last-child {
          border-right: 0;
        }
      }
    }

    .detail-contents {
      padding: 20px 0;
    }
  }
`;
function StockDetail() {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  // 차트 기간 선택값
  const [period, setPeriod] = useState("week");
  // 검색한 종목의 상세정보, 기간 차트정보
  const [data, setData] = useState({});
  // 종목 뉴스 정보
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useContext(store);

  useEffect(() => {
    // 종목 상세 정보 조회
    onGetStockDetail(state.stock?.code);

    // 종목 뉴스 조회
    onGetDetailNews();
  }, [pathname]);

  // 종목 상세 정보 조회
  const onGetStockDetail = async (code) => {
    if (!code) return;

    setLoading(true);
    await axios
      .get(`/api/getstock/${code}`)
      .then((res) => {
        const detailChartData = {};
        if (Object.keys(res.data).length > 0) {
          Object.keys(res.data).forEach((key) => {
            if (key === "info") return;
            const chartY = [];
            res.data[key].forEach((data) => {
              // chartY.push(data.index.toFixed(2));
              console.log("chart", key, data);
              // chartY.push({ x: data.date, y: [data.opening, data.high, data.low, data.closing] });
              // chartX.push(data.date);
            });
            detailChartData[key] = {
              series: {
                name: key,
                data: chartY,
              },
            };
          });
        }

        setData({
          info: res.data.info[0],
          week: detailChartData["week"],
          month: detailChartData["month"],
          year: detailChartData["year"],
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetStockDetail", error);
      });
  };

  // 종목 뉴스 조회
  const onGetDetailNews = async () => {
    setLoading(true);
    await axios
      .get(`/api/searchnews/${state.stock?.name}`)
      .then((res) => {
        console.log("res", res.data);
        setNewsData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetDetailNews", error);
      });
  };

  // 전일대비 비교 값
  let compare = { status: "same", icon: null, value: 0, rate: "0.00%" };
  if (data?.info) {
    const { closing, price } = data.info;
    // 등락율
    const rate = (((price - closing) / closing) * 100).toFixed(2);

    if (closing > price) {
      compare = { status: "down", icon: <CaretDownFilled />, value: closing - price, rate: `${rate}%` };
    } else if (closing < price) {
      compare = { status: "up", icon: <CaretUpFilled />, value: price - closing, rate: `${rate}%` };
    }
  }

  // 천 단위로 콤마(,) 표시
  const addComma = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 차트 기간 변경 시
  const changePeriod = (term) => {
    setPeriod(term);
  };

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
            <span className="stock-name">{data.info?.name}</span>
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
                  <div className="compare-text">{`전일대비 `} </div>
                  <div>
                    {compare.icon}
                    {addComma(compare.value)}
                  </div>
                  <div>{compare.rate}</div>
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
          <div className="period-btns">
            <button onClick={() => changePeriod("week")} className={`period-btn ${period === "week" ? "active" : ""}`}>
              일주일
            </button>
            <button
              onClick={() => changePeriod("month")}
              className={`period-btn ${period === "month" ? "active" : ""}`}
            >
              한 달
            </button>
            <button onClick={() => changePeriod("year")} className={`period-btn ${period === "year" ? "active" : ""}`}>
              일 년
            </button>
          </div>
          {/* {data && data[period] && (
            <Chart
              className="detail-chart-graph"
              options={data[period].options}
              series={[data[period].series]}
              type="line"
              height={300}
            />
          )} */}
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
          <Route path={`${path}/${state.stock?.code}/news`} render={() => <DetailNews newsInfo={newsData} />} />
        </div>
      </div>
    </DetailStyled>
  );
}

export default StockDetail;
