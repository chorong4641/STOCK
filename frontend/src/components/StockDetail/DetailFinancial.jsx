import { Table } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { store } from "../../store";
import Loading from "../Loading";

function DetailFinancial() {
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  const [finData, setFinData] = useState(null);

  useEffect(() => {
    onGetFinancial();
  }, [state.stock?.code]);

  const onGetFinancial = async () => {
    setLoading(true);

    await axios
      .get(`/api/financial/${state.stock?.code}`)
      .then((res) => {
        setLoading(false);
        // dispatch(getBookmark(res.data));
      })
      .catch((error) => {
        console.log("onGetFinancial", error);
      });
  };

  return (
    <div>
      <Loading loading={loading} />
      재무제표
    </div>
  );
}

export default DetailFinancial;
