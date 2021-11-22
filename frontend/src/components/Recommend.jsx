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
`;

function Recommend() {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useContext(store);
  const [data, setData] = useState(null);

  useEffect(() => {
    onGetRecommend();
  }, []);

  // 추천종목 조회
  const onGetRecommend = async () => {
    setLoading(true);

    const params = {
      id: state.user?.id,
      // period: '6month', '1year', '5year'
    };

    await axios
      .post(`/api/suggestion`, params)
      .then((res) => {
        setLoading(false);
        if (res.data) {
          const { graph, sector, company } = res.data;

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

          setData({
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
                width: 2
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

      {data && <Chart className="chart-graph" options={data.options} series={data.series} type="line" height="450" />}
    </RecommendStyled>
  );
}

export default Recommend;
