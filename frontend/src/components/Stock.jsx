import React from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";

const StockStyled = styled.div`
  width: 50%;
  margin: 0 auto;
`;

function Stock(props) {
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
    <StockStyled>
      종목명
      <Chart options={options} series={series} type="line" height={300} />
    </StockStyled>
  );
}

export default Stock;
