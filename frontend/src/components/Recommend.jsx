import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";
import { store } from "../store";
import Loading from "./Loading";
import { addComma } from "./common/CommonFunctions";

const RecommendStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;

  .recommend-container {
    display: flex;
    justify-content: center;
    margin-top: 50px;
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
      padding: 5px 0;
      font-weight: bold;
      color: #fff;
      background-color: #3f4753;
    }

    .company-list {
      width: 100%;
      border: 1px solid #f0f0f0;

      .company-name {
        border-bottom: 1px solid #f0f0f0;
        padding: 5px 0;

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
  const [graphData, setGraphData] = useState(null);
  const [rankData, setRankData] = useState([]);

  useEffect(() => {
    onGetRecommend();
  }, []);

  // 추천종목 조회
  const onGetRecommend = async () => {
    setLoading(true);

    const params = {
      period: "6month",
      // , '1year', '5year'
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
                // zoom: {
                //   enabled: false,
                // },
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
                    return addComma(value);
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

      {graphData && (
        <Chart className="chart-graph" options={graphData.options} series={graphData.series} type="line" height="450" />
      )}

      {rankData && (
        <>
          <div className="recommend-container">
            {rankData.map((item, index) => {
              const sector = Object.keys(item)[0];

              if (index <= 4) {
                return (
                  <div key={index} className="recommend-box">
                    {/* 섹터 이름 */}
                    <div className="sector-name">{sector}</div>
                    {/* 종목명 */}
                    <div className="company-list">
                      {item[sector].map((company, index) => (
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

          <div className="recommend-container">
            {rankData.map((item, index) => {
              const sector = Object.keys(item)[0];
              if (index > 4) {
                return (
                  <div key={index} className="recommend-box">
                    {/* 섹터 이름 */}
                    <div className="sector-name">{sector}</div>
                    {/* 종목명 */}
                    <div className="company-list">
                      {item[sector].map((company, index) => (
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
