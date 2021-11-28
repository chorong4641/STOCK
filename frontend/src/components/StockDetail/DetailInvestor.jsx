import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { store } from "../../store";
import { addComma } from "../common/CommonFunctions";
import CommonTable from "../common/CommonTable";
import Loading from "../Loading";

function DetailInvestor() {
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    onGetDetailInvestor();
  }, [state.stock?.code]);

  // 투자자별 매매동향 조회
  const onGetDetailInvestor = async () => {
    setLoading(true);

    // await axios
    //   .get(`/api/trading/${state.stock?.code}`)
    //   .then((res) => {
    //     setLoading(false);
    //     setTableData(res.data);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     console.log("onGetDetailInvestor", error);
    //   });

    setTableData([
      {
        date: 20211126,
        person: -4279387,
        foreign: 3896319,
        institutional: 450984,
        finance: 585091,
        insurance: -1310,
        commit: 28041,
        bank: -671,
        other_finance: 199,
        pension_fund: -161418,
        other_corporations: -71621,
        other_outsiders: 3705,
        private_equity: 1052,
        national_municipality: 0,
        trading_volume: 1679040,
      },
      {
        date: 20211125,
        person: -4412239,
        foreign: 3919721,
        institutional: 559253,
        finance: 635474,
        insurance: 1361,
        commit: 30753,
        bank: -671,
        other_finance: 199,
        pension_fund: -130832,
        other_corporations: -72605,
        other_outsiders: 5870,
        private_equity: 22969,
        national_municipality: 0,
        trading_volume: 2906344,
      },
      {
        date: 20211124,
        person: -3378199,
        foreign: 2963446,
        institutional: 472575,
        finance: 640217,
        insurance: -28975,
        commit: 4647,
        bank: -671,
        other_finance: 249,
        pension_fund: -159236,
        other_corporations: -60935,
        other_outsiders: 3113,
        private_equity: 16344,
        national_municipality: 0,
        trading_volume: 1589036,
      },
      {
        date: 20211123,
        person: -3578276,
        foreign: 2897634,
        institutional: 740320,
        finance: 830788,
        insurance: -25848,
        commit: 10999,
        bank: -816,
        other_finance: 913,
        pension_fund: -100687,
        other_corporations: -60511,
        other_outsiders: 833,
        private_equity: 24971,
        national_municipality: 0,
        trading_volume: 1981200,
      },
      {
        date: 20211122,
        person: -4359256,
        foreign: 3355115,
        institutional: 1046652,
        finance: 1025779,
        insurance: -9533,
        commit: 25439,
        bank: -816,
        other_finance: -3397,
        pension_fund: -18878,
        other_corporations: -37331,
        other_outsiders: -5180,
        private_equity: 28058,
        national_municipality: 0,
        trading_volume: 2213290,
      },
      {
        date: 20211119,
        person: -3763495,
        foreign: 2986391,
        institutional: 816700,
        finance: 858406,
        insurance: -16366,
        commit: 7717,
        bank: -816,
        other_finance: -7673,
        pension_fund: -57273,
        other_corporations: -37191,
        other_outsiders: -2405,
        private_equity: 32705,
        national_municipality: 0,
        trading_volume: 1512294,
      },
      {
        date: 20211118,
        person: -3268353,
        foreign: 2516518,
        institutional: 781900,
        finance: 795377,
        insurance: -16240,
        commit: 8938,
        bank: -816,
        other_finance: 131,
        pension_fund: -36227,
        other_corporations: -28962,
        other_outsiders: -1103,
        private_equity: 30737,
        national_municipality: 0,
        trading_volume: 1543924,
      },
      {
        date: 20211117,
        person: -3205680,
        foreign: 2481254,
        institutional: 745124,
        finance: 752583,
        insurance: -16565,
        commit: 13213,
        bank: -816,
        other_finance: 687,
        pension_fund: -36126,
        other_corporations: -21986,
        other_outsiders: 1288,
        private_equity: 32148,
        national_municipality: 0,
        trading_volume: 1675657,
      },
      {
        date: 20211116,
        person: -3583948,
        foreign: 2611925,
        institutional: 985287,
        finance: 927565,
        insurance: -14488,
        commit: 6271,
        bank: -816,
        other_finance: 608,
        pension_fund: 39212,
        other_corporations: -12041,
        other_outsiders: -1223,
        private_equity: 26935,
        national_municipality: 0,
        trading_volume: 1591390,
      },
      {
        date: 20211115,
        person: -3560247,
        foreign: 2604228,
        institutional: 962455,
        finance: 861985,
        insurance: -14434,
        commit: 11274,
        bank: -816,
        other_finance: 608,
        pension_fund: 67075,
        other_corporations: -5505,
        other_outsiders: -931,
        private_equity: 36763,
        national_municipality: 0,
        trading_volume: 1714170,
      },
      {
        date: 20211112,
        person: -2849966,
        foreign: 2059481,
        institutional: 793117,
        finance: 737460,
        insurance: -23565,
        commit: 16846,
        bank: -816,
        other_finance: 608,
        pension_fund: 44432,
        other_corporations: -2865,
        other_outsiders: 233,
        private_equity: 18152,
        national_municipality: 0,
        trading_volume: 2100660,
      },
      {
        date: 20211111,
        person: -2144024,
        foreign: 1495573,
        institutional: 644700,
        finance: 644776,
        insurance: -25344,
        commit: -10915,
        bank: -816,
        other_finance: 619,
        pension_fund: 20877,
        other_corporations: 1530,
        other_outsiders: 2221,
        private_equity: 15503,
        national_municipality: 0,
        trading_volume: 1955371,
      },
      {
        date: 20211110,
        person: -1815880,
        foreign: 1178137,
        institutional: 630399,
        finance: 478569,
        insurance: -23650,
        commit: -5258,
        bank: 775,
        other_finance: 1341,
        pension_fund: 153459,
        other_corporations: 4781,
        other_outsiders: 2563,
        private_equity: 25163,
        national_municipality: 0,
        trading_volume: 1598893,
      },
      {
        date: 20211109,
        person: -1877543,
        foreign: 1232946,
        institutional: 633610,
        finance: 478256,
        insurance: -28120,
        commit: -746,
        bank: 762,
        other_finance: 1261,
        pension_fund: 167680,
        other_corporations: 8148,
        other_outsiders: 2839,
        private_equity: 14517,
        national_municipality: 0,
        trading_volume: 1990889,
      },
      {
        date: 20211108,
        person: -1633508,
        foreign: 1086881,
        institutional: 538017,
        finance: 330395,
        insurance: -22089,
        commit: 8204,
        bank: 1872,
        other_finance: 1261,
        pension_fund: 209407,
        other_corporations: 6627,
        other_outsiders: 1983,
        private_equity: 8967,
        national_municipality: 0,
        trading_volume: 4026899,
      },
      {
        date: 20211105,
        person: -2408672,
        foreign: 1780741,
        institutional: 625830,
        finance: 282467,
        insurance: -18061,
        commit: 43351,
        bank: 1872,
        other_finance: 1561,
        pension_fund: 288056,
        other_corporations: 1291,
        other_outsiders: 810,
        private_equity: 26584,
        national_municipality: 0,
        trading_volume: 2810726,
      },
      {
        date: 20211104,
        person: -2660123,
        foreign: 1989289,
        institutional: 685259,
        finance: 349984,
        insurance: -27042,
        commit: 35648,
        bank: 1678,
        other_finance: 1848,
        pension_fund: 295379,
        other_corporations: -14439,
        other_outsiders: 14,
        private_equity: 27764,
        national_municipality: 0,
        trading_volume: 6001098,
      },
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const columns = [
    {
      title: "일자",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (value, record) => {
        const strValue = value.toString();
        const year = strValue.substring(0, 4);
        const month = strValue.substring(4, 6);
        const day = strValue.substring(6, 8);

        return `${year}/${month}/${day}`;
      },
    },
    {
      title: "개인",
      dataIndex: "person",
      key: "person",
      align: "center",
      render: (value, record) => {
        let text = addComma(value);
        if (value) {
          text = value > 0 ? <span className="red">{`+${text}`}</span> : <span className="blue">{text}</span>;
        }
        return text;
      },
    },
    {
      title: "기관",
      dataIndex: "institutional",
      key: "institutional",
      align: "center",
      render: (value, record) => {
        let text = addComma(value);
        if (value) {
          text = value > 0 ? <span className="red">{`+${text}`}</span> : <span className="blue">{text}</span>;
        }
        return text;
      },
    },
    {
      title: "외국인",
      dataIndex: "foreign",
      key: "foreign",
      align: "center",
      render: (value, record) => {
        let text = addComma(value);
        if (value) {
          text = value > 0 ? <span className="red">{`+${text}`}</span> : <span className="blue">{text}</span>;
        }
        return text;
      },
    },
    {
      title: "금융투자",
      dataIndex: "finance",
      key: "finance",
      align: "center",
      render: (value, record) => {
        let text = addComma(value);
        if (value) {
          text = value > 0 ? <span className="red">{`+${text}`}</span> : <span className="blue">{text}</span>;
        }
        return text;
      },
    },
    {
      title: "연기금등",
      dataIndex: "pension_fund",
      key: "pension_fund",
      align: "center",
      render: (value, record) => {
        let text = addComma(value);
        if (value) {
          text = value > 0 ? <span className="red">{`+${text}`}</span> : <span className="blue">{text}</span>;
        }
        return text;
      },
    },
  ];

  return (
    <div>
      <Loading loading={loading} />

      <CommonTable data={tableData} columns={columns} />
    </div>
  );
}

export default DetailInvestor;
