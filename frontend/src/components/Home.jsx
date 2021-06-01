import React, { useEffect, useContext, useState } from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";
import axios from "axios";
import { Select, Input } from "antd";
import { store } from "../store";
import { getStockMarket } from "../store/actions";

const HomeStyled = styled.div`
  width: 80%;
  margin: 0 auto;

  .search-input {
    width: 50%;
    margin: 10px auto;

    input {
      height: 45px;
    }

    button {
      height: 45px;
    }
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
        margin-bottom: 15px;
        font-size: 1rem;
        font-weight: 700;
        text-align: center;
      }

      .chart-graph {
        min-width: 450px;
      }
    }
  }
`;

function Home(props) {
  const [state, dispatch] = useContext(store);
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectOption, setSelectOption] = useState({});
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    onGetStockMarket();
  }, []);

  // 시장 지수 조회
  const onGetStockMarket = () => {
    setLoading(true);
    axios
      .get("/api/chart/domestic")
      .then((res) => {
        console.log("response", res);

        setMarketData({ ...marketData, domestic: res.data });
      })
      .catch((error) => {
        console.log("onGetStockMarket domestic", error);
      });

    axios
      .get("/api/chart/foreign")
      .then((res) => {
        console.log("response", res);

        setMarketData({ ...marketData, foreign: res.data });
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetStockMarket foreign", error);
      });
      
      // {
      //   foreign: {
      //     DOW: [
      //       { date: 20210528, index: 34558.5 },
      //       { date: 20210527, index: 34432.46875 },
      //     ],
      //     NASDAQ: [
      //       { date: 20210529, index: 34532.46875 },
      //       { date: 20210528, index: 34558.5 },
      //       { date: 20210527, index: 34432.46875 },
      //     ],
      //     SP500: [
      //       { date: 20210528, index: 34558.5 },
      //       { date: 20210527, index: 34432.46875 },
      //     ],
      //     SH: [
      //       { date: 20210528, index: 34558.5 },
      //       { date: 20210527, index: 34432.46875 },
      //     ],
      //   },
      // }
  };

  // 검색 문자열과 일치하는 주식 리스트 조회
  const onGetMatchedStock = (value) => {
    setLoading(true);

    axios
      .get(`/api/searchstock/${value}`)
      .then((res) => {
        console.log("response", res);

        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetMatchedStock", error);
      });
  };

  // 종목명 검색
  const onChangeSearch = (e) => {
    onGetMatchedStock(e.target.value);
  };

  // 해외 주식 시장지수
  const foreignData = [];
  if (Object.keys(marketData).length > 0) {
    Object.keys(marketData.foreign).forEach((key) => {
      const chartY = [];
      const chartX = [];
      marketData.foreign[key].map((data) => {
        chartY.push(data.index);
        chartX.push(data.date);
      });

      let marketText = "";
      if (key === "DOW") {
        marketText = "다우(DOW)";
      } else if (key === "NASDAQ") {
        marketText = "나스닥(NASDAQ)";
      } else if (key === "SP500") {
        marketText = "S&P 500";
      } else if (key === "SH") {
        marketText = "상해(SH)";
      }

      foreignData.push({
        text: marketText,
        series: {
          name: key,
          data: chartY,
        },
        options: {
          chart: {
            id: key,
          },
          xaxis: {
            categories: chartX,
          },
        },
      });
    });
  }

  return (
    <HomeStyled>
      <div className="search-input">
        <Input.Search placeholder="종목명 입력" onChange={onChangeSearch} onSearch={onGetMatchedStock} enterButton />
      </div>

      <div className="market-chart">
        {foreignData.length > 0 &&
          foreignData.map((data) => {
            return (
              <div className="chart-item">
                <div className="chart-text">{data.text}</div>
                <Chart className="chart-graph" options={data.options} series={[data.series]} type="line" />
              </div>
            );
          })}
      </div>
    </HomeStyled>
  );
}

export default Home;
