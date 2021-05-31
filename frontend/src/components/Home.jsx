import React, { useEffect, useContext, useState } from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";
import { Select, Input } from "antd";
import axios from "axios";
import { store } from "../store";
// import { getStockMarket } from "../store/actions";

const HomeStyled = styled.div`
  width: 70%;
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

  .chart-row {
    display: flex;
    justify-content: space-between;
    margin: 30px 60px;
  }
`;

function Home(props) {
  const [state, dispatch] = useContext(store);
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [selectOption, setSelectOption] = useState({});

  useEffect(() => {
    onGetStockMarket();
  }, []);

  // 시장 지수 조회
  const onGetStockMarket = () => {
    setLoading(true);
    axios
      .get("/polls/chart/domestic")
      .then((res) => {
        console.log("response", res);
      })
      .catch((error) => {
        console.log("onGetStockMarket domestic", error);
      });

    axios
      .get("/polls/chart/foreign")
      .then((res) => {
        console.log("response", res);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetStockMarket foreign", error);
      });
  };

  // 검색 문자열과 일치하는 주식 리스트 조회
  const onGetMatchedStock = (value) => {
    setLoading(true);
    // const params = {
    //   searchText: value,
    // };
    // axios
    //   .get("/polls/?", { params })
    //   .then((res) => {
    //     console.log("response", res);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log("onGetMatchedStock", error);
    //   });
  };

  // 종목명 검색
  const onSearch = (value) => {
    console.log(value);
    onGetMatchedStock(value);
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];

  const options = {
    chart: {
      id: "stock",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

  return (
    <HomeStyled>
      <div className="search-input">
        <Input.Search placeholder="종목명 입력" onSearch={onSearch} onChange={onSearch} enterButton />
      </div>

      <div className="chart-row">
        <Chart options={options} series={series} type="line" />
        <Chart options={options} series={series} type="line" />
      </div>
      <div className="chart-row">
        <Chart options={options} series={series} type="line" />
        <Chart options={options} series={series} type="line" />
      </div>
    </HomeStyled>
  );
}

export default Home;
