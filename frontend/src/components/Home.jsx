import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";
import styled from "styled-components";
import axios from "axios";
// import { store } from "../store";
// import { getStockMarket } from "../store/actions";

const HomeStyled = styled.div`
  width: 80%;
  margin: 0 auto;

  .search-input {
    position: relative;
    display: flex;
    align-items: center;
    width: 50%;
    margin: 10px auto;

    .ant-select {
      width: 100%;

      &.ant-select-focused {
        .ant-select-selector {
          border-color: #3f4753;
          box-shadow: none;
        }
      }

      &:hover {
        border-color: #3f4753;

        .ant-select-selector {
          border-color: inherit;
          box-shadow: none;
        }
      }

      .ant-select-selector {
        height: 45px;
        padding-right: 45px;

        input {
          height: 100%;
          padding-right: 35px;
        }
      }
    }

    .search-icon {
      position: absolute;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 45px;
      height: 45px;
      color: #3f4753;
      font-size: 18px;
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
  // const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [marketData, setMarketData] = useState({});
  const [searchData, setSearchData] = useState([]);
  const history = useHistory();
  const { Option } = Select;

  useEffect(() => {
    onGetStockMarket();
  }, []);

  // 시장 지수 조회
  const onGetStockMarket = () => {
    setLoading(true);
    axios
      .get("/api/chart/domestic")
      .then((res) => {
        // 국내 주식 시장지수
        const domesticData = [];
        if (Object.keys(res.data).length > 0) {
          Object.keys(res.data).forEach((key) => {
            const chartY = [];
            const chartX = [];
            res.data[key].map((data) => {
              chartY.push(data.index);
              chartX.push(data.date);
            });

            let marketText = "";
            if (key === "KOSPI") {
              marketText = "코스피(KOSPI)";
            } else if (key === "KOSDAQ") {
              marketText = "코스닥(KOSDAQ)";
            }

            domesticData.push({
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
        setMarketData({ ...marketData, domestic: domesticData });
      })
      .catch((error) => {
        console.log("onGetStockMarket domestic", error);
      });

    axios
      .get("/api/chart/foreign")
      .then((res) => {
        // 해외 주식 시장지수
        const foreignData = [];
        if (Object.keys(res.data).length > 0) {
          Object.keys(res.data).forEach((key) => {
            const chartY = [];
            const chartX = [];
            res.data[key].map((data) => {
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
        setMarketData({ ...marketData, foreign: foreignData });
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetStockMarket foreign", error);
      });
  };

  // 종목명 입력 이벤트
  const onChangeSearch = (value) => {
    setSearchText(value);

    if (value) {
      onGetMatchedStock(value);
    }
  };

  // 검색 문자열과 일치하는 주식 리스트 조회
  const onGetMatchedStock = (value) => {
    if (!value) return;
    setLoading(true);

    axios
      .get(`/api/searchstock/${value}`)
      .then((res) => {
        setSearchData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetMatchedStock", error);
      });
  };

  // 검색한 종목 선택 이벤트
  const onShowDetail = (value) => {
    history.push(`/stock/${value}`);
  };

  // 종목 드롭다운 리스트
  const options = searchData?.map((data) => <Option key={data.code}>{data.name}</Option>);

  return (
    <HomeStyled>
      <div className="search-input">
        <Select
          showSearch
          value={searchText}
          placeholder="종목명 입력"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={onChangeSearch}
          onChange={onShowDetail}
          notFoundContent={null}
        >
          {options}
        </Select>
        <div className="search-icon">
          <SearchOutlined />
        </div>
      </div>

      <div className="market-chart">
        {marketData?.domestic?.length > 0 &&
          marketData?.domestic.map((data) => {
            return (
              <div className="chart-item">
                <div className="chart-text">{data.text}</div>
                <Chart className="chart-graph" options={data.options} series={[data.series]} type="line" />
              </div>
            );
          })}
        {marketData?.foreign?.length > 0 &&
          marketData?.foreign.map((data) => {
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
