import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";
import { store } from "../store";
import Loading from "./Loading";
import { addComma } from "./common/CommonFunctions";
import { FundFilled, LikeFilled } from "@ant-design/icons";

const RecommendStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;

  .group-text {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: bold;

    .anticon {
      margin-right: 5px;
      color: #9d141d;
    }
  }

  .period-btns {
    padding: 0 0 5px 10px;

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

  .chart-graph {
    margin-bottom: 20px;
  }

  .recommend-container {
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
  }

  .recommend-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    text-align: center;

    .sector-name {
      width: 100%;
      padding: 7px 0;
      font-weight: bold;
      color: #fff;
      background-color: #3f4753;
    }

    .company-list {
      width: 100%;
      border: 1px solid #f0f0f0;

      .company-name {
        border-bottom: 1px solid #f0f0f0;
        height: 34px;
        line-height: 34px;

        &:last-child {
          border-bottom: 1px solid transparent;
        }
      }
    }
  }
`;

function Recommend() {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useContext(store);
  // 기간별 시가총액 그래프
  const [graphData, setGraphData] = useState(null);
  // 섹터, 종목명 데이터
  const [rankData, setRankData] = useState([]);
  // 선택한 기간
  const [period, setPeriod] = useState("3month");

  useEffect(() => {
    onGetRecommend();
  }, [period]);

  // 추천종목 조회
  const onGetRecommend = async () => {
    setLoading(true);

    const params = {
      period: period,
    };

    await axios
      .post(`/api/suggestion`, params)
      .then((res) => {
        setLoading(false);
        if (res.data) {
          const { graph, sug } = res.data;

          // 섹터별 종목 데이터
          setRankData(sug);

          // 그래프 데이터
          const parsedGraph = JSON.parse(graph);

          // 날짜 키 배열
          const dateKeys = [];

          // 섹터별 데이터
          const seriesData = [];
          Object.keys(parsedGraph).forEach((key) => {
            const curDataKey = parsedGraph[key];
            // 날짜별 시총값
            const dataArr = [];
            Object.keys(curDataKey).forEach((date) => {
              dataArr.push(curDataKey[date]);
              dateKeys.push(date);
            });
            seriesData.push({
              name: key,
              data: dataArr,
            });
          });

          setGraphData({
            series: seriesData,
            options: {
              chart: {
                type: "line",
              },
              xaxis: {
                categories: dateKeys,
                tooltip: {
                  enabled: false,
                },
                labels: { rotate: 0 },
                tickAmount: 10,
              },
              yaxis: {
                labels: {
                  formatter: function (value) {
                    return `${addComma(value / 100000000)}억`;
                  },
                },
              },
              stroke: {
                curve: "straight",
                width: 2,
              },
              colors: [
                "#008ffb",
                "#00e396",
                "#feb019",
                "#ff4560",
                "#775dd0",
                "#2a587b",
                "#2c8400",
                "#f4f868",
                "#fc9ec9",
                "#32fff4",
              ],
            },
          });
        }
      })
      .catch((error) => {
        console.log("onGetRecommend", error);
      });
  };

  return (
    <RecommendStyled>
      <Loading loading={loading} />

      <div className="group-text">
        <FundFilled />
        업종별 시가총액 그래프
      </div>
      {graphData && (
        <>
          {/* 기간 설정 버튼 */}
          <div className="period-btns">
            <button onClick={() => setPeriod("3month")} className={`period-btn ${period === "3month" ? "active" : ""}`}>
              3개월
            </button>
            <button onClick={() => setPeriod("6month")} className={`period-btn ${period === "6month" ? "active" : ""}`}>
              6개월
            </button>
            <button onClick={() => setPeriod("9month")} className={`period-btn ${period === "9month" ? "active" : ""}`}>
              9개월
            </button>
            <button onClick={() => setPeriod("1year")} className={`period-btn ${period === "1year" ? "active" : ""}`}>
              1년
            </button>
          </div>
          {/* 시가총액 그래프 */}
          <Chart
            className="chart-graph"
            options={graphData.options}
            series={graphData.series}
            type="line"
            height="450"
          />
        </>
      )}

      {rankData && (
        <>
          <div className="group-text">
            <LikeFilled />
            업종별 종목 추천
          </div>
          {/* 첫번째줄 */}
          <div className="recommend-container">
            {rankData.map((item, index) => {
              const sector = Object.keys(item)[0];
              const contentList = [...item[sector]];
              for (let i = 0; i < 5 - item[sector].length; i++) {
                contentList.push(" ");
              }

              if (index <= 4) {
                return (
                  <div key={index} className="recommend-box">
                    {/* 섹터 이름 */}
                    <div className="sector-name">{sector}</div>
                    {/* 종목명 */}
                    <div className="company-list">
                      {contentList.map((company, index) => (
                        <div key={company} className="company-name">
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return <></>;
            })}
          </div>

          {/* 두번째줄 */}
          <div className="recommend-container">
            {rankData.map((item, index) => {
              const sector = Object.keys(item)[0];
              const contentList = [...item[sector]];
              for (let i = 0; i < 5 - item[sector].length; i++) {
                contentList.push(" ");
              }

              if (index > 4) {
                return (
                  <div key={index} className="recommend-box">
                    {/* 섹터 이름 */}
                    <div className="sector-name">{sector}</div>
                    {/* 종목명 */}
                    <div className="company-list">
                      {contentList.map((company) => (
                        <div key={company} className="company-name">
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return <></>;
            })}
          </div>
        </>
      )}
    </RecommendStyled>
  );
}

export default Recommend;
