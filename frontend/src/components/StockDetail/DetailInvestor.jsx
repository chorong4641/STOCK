import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { store } from "../../store";

function DetailInvestor() {
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onGetDetailInvestor();
  }, [state.stock?.code]);

  const onGetDetailInvestor = async () => {
    setLoading(true);

    await axios
      .get(`/api/trading/${state.stock?.code}`)
      .then((res) => {
        // setBoardData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetDetailInvestor", error);
      });
    //
  };

  return <div>투자자별 매매동향</div>;
}

export default DetailInvestor;
