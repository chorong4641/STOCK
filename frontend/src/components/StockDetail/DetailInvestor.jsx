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

    await axios
      .get(`/api/trading/${state.stock?.code}`)
      .then((res) => {
        setLoading(false);
        setTableData(res.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log("onGetDetailInvestor", error);
      });
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
