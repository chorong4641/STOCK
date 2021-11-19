import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useHistory, useLocation } from "react-router-dom";
import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";
import Loading from "./Loading";
import StockDetail from "./StockDetail";
import { store } from "../store";
import { selectStock } from "../store/actions";
import CommonSelect from "./common/CommonSelect";

const StockStyled = styled.div`
  width: 80%;
  margin: 0 auto;

  .apexcharts-toolbar {
    // display: none;
  }

  .market-chart {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    height: 100%;

    .chart-item {
      margin: 20px;
      padding: 20px;
      background-color: #fbfbfb;
      border-radius: 5px;

      .chart-text {
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
      }
      
      .chart-index {
        text-align: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .chart-graph {
        min-width: 450px;
      }
    }
  }
`;

function Stock(props) {
  const history = useHistory();
  const { pathname } = useLocation();
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  // 시장지수(국내, 해외)
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    if (pathname === "/stock") {
      dispatch(selectStock(null));
      // 시장지수 조회
      onGetStockMarket();
    }
  }, []);

  // 시장 지수 조회
  const onGetStockMarket = async () => {
    setLoading(true);

    await axios
      .get("/api/chart/stock")
      .then((res) => {
        const chartData = [];
        if (Object.keys(res.data).length > 0) {
          Object.keys(res.data).forEach((key) => {
            const chartY = [];
            const chartX = [];
            res.data[key].forEach((data) => {
              chartY.push(data.index.toFixed(2));
              chartX.push(data.date.toString().substring(4, 8));
            });

            let marketText = "";
            if (key === "KOSPI") {
              marketText = "코스피(KOSPI)";
            } else if (key === "KOSDAQ") {
              marketText = "코스닥(KOSDAQ)";
            } else if (key === "DOW") {
              marketText = "다우(DOW)";
            } else if (key === "NASDAQ") {
              marketText = "나스닥(NASDAQ)";
            } else if (key === "SP500") {
              marketText = "S&P 500";
            } else if (key === "SH") {
              marketText = "상해(SH)";
            }

            chartData.push({
              text: marketText,
              series: {
                name: key,
                data: chartY,
              },
              options: {
                chart: {
                  id: key,
                  zoom: {
                    enabled: false,
                  },
                },
                xaxis: {
                  categories: chartX,
                  tooltip: {
                    enabled: false,
                  },
                },
                colors: ["#3f4753"],
              },
            });
          });
        }
        setLoading(false);
        setMarketData(chartData);
      })
      .catch((error) => {
        console.log("onGetStockMarket", error);
      });
  };

  return (
    <StockStyled>
      <Loading loading={loading} />

      <div className="half">
        <CommonSelect placeholder="종목명 검색" onAfterSelect={(value) => history.push(`/stock/${value}`)} />
      </div>

      {state.stock?.code ? (
        // 종목 상세
        <StockDetail />
      ) : (
        // 시장지수
        <div className="market-chart">
          {marketData?.length > 0 &&
            marketData?.map((data) => {
              return (
                <div className="chart-item" key={data.text}>
                  <div className="chart-text">{data.text}</div>
                  <div className="chart-index">{data.series.data[data.series.data.length - 1]}</div>
                  <Chart className="chart-graph" options={data.options} series={[data.series]} type="line" />
                </div>
              );
            })}
        </div>
      )}
    </StockStyled>
  );
}

export default Stock;
