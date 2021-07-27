import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useHistory } from "react-router-dom";
import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";
import Loading from "./Loading";
import StockDetail from "./StockDetail";
import { store } from "../store";
import { selectStock } from "../store/actions";

const StockStyled = styled.div`
  width: 80%;
  margin: 0 auto;

  .apexcharts-toolbar {
    display: none;
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

const SelectStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 50%;
  margin: 30px auto;

  .ant-select {
    width: 100%;

    &.ant-select-focused {
      .ant-select-selector {
        border-color: #3f4753 !important;
        box-shadow: none !important;
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
      line-height: 43px;
      padding-right: 45px;

      input {
        height: 100%;
        padding-right: 35px;
      }

      .ant-select-selection-item,
      .ant-select-selection-placeholder {
        line-height: inherit;
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
`;

function Stock(props) {
  const history = useHistory();
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  // 시장지수(국내, 해외)
  const [marketData, setMarketData] = useState({});
  // 검색한 종목과 일치하는 데이터(종목명, 코드)
  const [searchData, setSearchData] = useState([]);
  // 검색한 종목명
  const [searchText, setSearchText] = useState("");

  const { Option } = Select;

  useEffect(() => {
    // 시장지수 조회
    onGetStockMarket();
  }, []);

  // 시장 지수 조회
  const onGetStockMarket = async () => {
    setLoading(true);
    // 종목 상세 초기화
    await dispatch(selectStock(null));

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
              chartX.push(data.date);
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
                },
                xaxis: {
                  categories: chartX,
                },
              },
            });
          });
        }
        setMarketData(chartData);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetStockMarket", error);
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
  const onGetMatchedStock = async (value) => {
    if (!value) return;

    await axios
      .get(`/api/searchstock/${value}`)
      .then((res) => {
        setSearchData(res.data);
      })
      .catch((error) => {
        console.log("onGetMatchedStock", error);
      });
  };

  // 검색한 종목 선택 이벤트
  const onShowDetail = async (value) => {
    const selectInfo = searchData?.filter((data) => data.code === value)[0];
    if (selectInfo) {
      await dispatch(selectStock(selectInfo));
      history.push(`/stock/${value}`);
    }
  };

  // 종목 드롭다운 리스트
  const stockDropdown = searchData?.map((data) => <Option key={data.code}>{data.name}</Option>);

  return (
    <StockStyled>
      <Loading loading={loading} />

      <SelectStyled>
        <Select
          showSearch
          value={searchText || null}
          placeholder="종목명 검색"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={onChangeSearch}
          onChange={onShowDetail}
          notFoundContent="검색 결과가 없습니다."
        >
          {stockDropdown}
        </Select>
        <div className="search-icon">
          <SearchOutlined />
        </div>
      </SelectStyled>

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
