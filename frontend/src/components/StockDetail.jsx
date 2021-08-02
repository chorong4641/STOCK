import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Chart from "react-apexcharts";
import { CaretDownFilled, CaretUpFilled, HeartFilled, HeartOutlined, PlusSquareFilled } from "@ant-design/icons";
import { NavLink, Redirect, Route, Router, Switch, useLocation, useRouteMatch } from "react-router-dom";
import Loading from "./Loading";
import DetailNews from "./StockDetail/DetailNews";
import { store } from "../store";
import { Popover } from "antd";
import { getBookmark } from "../store/actions";

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

        .red {
          color: #d23a3a;
        }

        .blue {
          color: #3a77d2;
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
  // 종목 뉴스 정보
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  // 관심그룹 리스트
  const [groupData, setGroupData] = useState({});
  // 선택한 관심그룹번호
  const [selectGroupIdx, setSelectGroupIdx] = useState(0);
  // 팝오버 열기/닫기
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 종목 상세 정보 조회
    onGetStockDetail(state.stock?.code);
  }, [state.stock?.code]);

  // 종목 상세 정보 조회
  const onGetStockDetail = async (code) => {
    if (!code) return;

    setLoading(true);
    await axios
      .get(`/api/getstock/${code}`)
      .then((res) => {
        // 종목 뉴스 조회
        onGetDetailNews();

        const detailChartData = {};
        if (Object.keys(res.data).length > 0) {
          Object.keys(res.data).forEach((key) => {
            if (key === "info") return;
            const chartData = [];
            res.data[key].forEach((value) => {
              const { date, opening, high, low, closing } = value;
              chartData.push({
                x: date.toString(),
                y: [opening, high, low, closing],
              });
            });

            detailChartData[key] = {
              series: [{ data: chartData }],
              options: {
                chart: {
                  type: "candlestick",
                  height: 300,
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
                      const date = value.substring(4, 8);
                      return date;
                    },
                  },
                  tooltip: {
                    enabled: false,
                  },
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
        setNewsData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetDetailNews", error);
      });
  };

  // 관심그룹 및 종목 조회
  const onGetBookmark = async () => {
    await axios
      .get("/api/bookmark/read")
      .then((res) => {
        const groupObj = {};
        // dispatch(getBookmark(res.data));

        if (res.data) {
          res.data.forEach((item) => {
            if (groupObj[item.group_idx]) {
              groupObj[item.group_idx] = { key: item.group_idx, name: item.name };
            } else {
              groupObj[item.group_idx] = {};
              groupObj[item.group_idx] = { key: item.group_idx, name: item.name };
            }
          });

          setGroupData(groupObj);
          console.log("group", groupObj);
        }
      })
      .catch((error) => {
        console.log("onGetBookmark", error);
      });
  };

  // 관심종목 추가
  const onAddBookmark = async () => {
    console.log("selectGroupIdx", selectGroupIdx);
    await axios
      .get(`/api/bookmark/stock_create/${state.stock?.code}/${selectGroupIdx}`)
      .then((res) => {
        console.log("res", res);
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

  console.log("Object.keys(groupData)", Object.keys(groupData));

  return (
    <DetailStyled>
      <Loading loading={loading} />

      {/* 상단 종목 정보 영역(현재가, 차트 등) */}
      <div className="detail-top">
        <div className="detail-info">
          <div className="stock-item">
            <span className="stock-name">
              <Popover
                title="종목그룹 선택"
                placement="bottomLeft"
                overlayClassName="common-popover"
                content={
                  <PopoverStyled>
                    <div className="bookmark-list">
                      {Object.keys(groupData).map((key) => {
                        return (
                          <div
                            className={`bookmark-list-item${selectGroupIdx === key ? " active" : ""}`}
                            onClick={() => setSelectGroupIdx(key)}
                          >
                            {groupData[key].name}
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

              {/* {북마크 ? <HeartOutlined /> : <HeartFilled />} */}
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
          <div className="period-btns">
            <button onClick={() => changePeriod("week")} className={`period-btn ${period === "week" ? "active" : ""}`}>
              일
            </button>
            <button
              onClick={() => changePeriod("month")}
              className={`period-btn ${period === "month" ? "active" : ""}`}
            >
              월
            </button>
            <button onClick={() => changePeriod("year")} className={`period-btn ${period === "year" ? "active" : ""}`}>
              년
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
          {data && data[period] && (
            <Chart series={data[period].series} options={data[period].options} type="candlestick" height={300} />
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
          <Route path={`${path}/${state.stock?.code}/news`} render={() => <DetailNews newsInfo={newsData} />} />
        </div>
      </div>
    </DetailStyled>
  );
}

export default StockDetail;
