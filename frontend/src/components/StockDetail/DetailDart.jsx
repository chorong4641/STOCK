import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { store } from "../../store";
import Loading from "../Loading";
import CommonTable from "../common/CommonTable";

function DetailDisclosure() {
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    onGetDart();
  }, [state.stock?.code]);

  // 공시정보 조회
  const onGetDart = async () => {
    setLoading(true);

    await axios
      .get(`/api/disclosure/${state.stock?.code}`)
      .then((res) => {
        setLoading(false);
        setTableData(res.data);
      })
      .catch((error) => {
        console.log("onGetDart", error);
      });
  };

  const columns = [
    {
      title: "공시제목",
      dataIndex: "report_nm",
      key: "report_nm",
      render: (value, record) => {
        return (
          <a href={record.url} target="_blank" rel="noreferrer" style={{ textAlign: "left" }}>
            {value}
          </a>
        );
      },
    },
    {
      title: "날짜",
      dataIndex: "rcept_dt",
      key: "rcept_dt",
      align: "center",
      render: (value, record) => {
        const year = value.substring(0, 4);
        const month = value.substring(4, 6);
        const day = value.substring(6, 8);
        return `${year}/${month}/${day}`;
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

export default DetailDisclosure;
