import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { store } from "../store";
import { getBookmark } from "../store/actions";

const MyStockStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;

  .group-item {
    position: relative;
    margin: 30px;

    .group-title {
      display: flex;
      align-items: center;
      margin: 10px;
      font-size: 16px;
      font-weight: bold;

      .group-btn {
        position: absolute;
        right: 0;

        button {
          margin-left: 10px;
          color: #fff;
          font-size: 13px;
          background-color: #3f4753;

          .anticon {
            margin-right: 5px;
          }
        }
      }
    }
  }
`;
function MyStock(props) {
  const [state, dispatch] = useContext(store);
  const [groupData, setGroupData] = useState({});
  const [selectedStock, setSelectedStock] = useState([]);

  useEffect(() => {
    onGetBookmark();
  }, []);

  // 관심그룹 및 종목 조회
  const onGetBookmark = async () => {
    await axios
      .get("/api/bookmark/read")
      .then((res) => {
        const groupObj = {};
        dispatch(getBookmark(res.data));

        if (res.data) {
          res.data.forEach((item) => {
            if (groupObj[item.group_idx]) {
              groupObj[item.group_idx].push({ key: item.code, ...item });
            } else {
              groupObj[item.group_idx] = [];
              groupObj[item.group_idx].push({ key: item.code, ...item });
            }
          });

          setGroupData(groupObj);
        }
      })
      .catch((error) => {
        console.log("onGetBookmark", error);
      });
  };

  // 관심그룹 삭제
  const onDeleteGroup = async (groupKey) => {
    console.log("groupKey", groupKey);
    // param: group_idx
    // await axios
    //   .get(`/api/bookmark/group_delete/${groupKey}`)
    //   .then((res) => {
    //     const groupObj = {};
    //     dispatch(getBookmark(res.data));

    //     if (res.data) {
    //       // setGroupData(groupObj);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("onDeleteGroup", error);
    //   });
  };

  // 관심종목 삭제
  const onDeleteStock = async () => {
    console.log("onDeleteStock", selectedStock);
    // await axios
    //   .get("/api/bookmark/stock_delete")
    //   .then((res) => {
    //     const groupObj = {};
    //     dispatch(getBookmark(res.data));
    //     if (res.data) {
    //       // setGroupData(groupObj);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("onDeleteStock", error);
    //   });
  };

  // 테이블 항목
  const columns = [
    // {
    //   title: "그룹번호",
    //   dataIndex: "group_idx",
    //   key: "group_idx",
    // },
    {
      title: "종목코드",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "종목명",
      dataIndex: "stock_name",
      key: "stock_name",
    },
    {
      title: "현재가",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "전일대비",
      dataIndex: "compare",
      key: "compare",
    },
    {
      title: "등락률",
      dataIndex: "rate",
      key: "rate",
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    // selectedRowKeys: selectedStock,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedStock(selectedRowKeys);
    },
  };

  return (
    <MyStockStyled>
      {Object.keys(groupData)?.map((key, index) => {
        return (
          <div className="group-item" key={index}>
            <div className="group-title">
              <span>{groupData[key][0].name}</span>

              <div className="group-btn">
                <button onClick={onDeleteStock}>
                  <DeleteOutlined />
                  종목 삭제
                </button>
                <button onClick={() => onDeleteGroup(groupData[key][0].group_idx)}>
                  <DeleteOutlined />
                  그룹 삭제
                </button>
              </div>
            </div>
            <Table dataSource={groupData[key]} columns={columns} size="small" rowSelection={rowSelection} />
          </div>
        );
      })}
    </MyStockStyled>
  );
}

export default MyStock;
