import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";
import { useContext } from "react";
import { store } from "../store";
import axios from "axios";
// import { getStockMarket } from "../store/actions";

const HomeStyled = styled.div`
  .chart-row {
    display: flex;
    justify-content: center;
  }
`;

function Home(props) {
  const [state, dispatch] = useContext(store);

  useEffect(() => {
    onGetStockMarket();
  }, []);

  const onGetStockMarket = async () => {
    axios
      .get("/polls/chart/domestic")
      .then((res) => {
        console.log("response", res);
      })
      .catch((error) => {
        console.log("onGetStockMarket", error);
      });
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
