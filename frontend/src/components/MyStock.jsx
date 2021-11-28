import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { store } from "../store";
import { getBookmark } from "../store/actions";
import { validRequired } from "../utils/validation";
import { addComma } from "./common/CommonFunctions";
import CommonInput from "./common/CommonInput";
import CommonTable from "./common/CommonTable";
import Loading from "./Loading";

const MyStockStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;

  .add-btn-area {
    margin-left: 20px;
  }

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
      }
    }
  }

  .stock-btn {
    margin-left: 10px;
    padding: 3px 10px;
    color: #fff;
    font-size: 13px;
    background-color: #3f4753;

    .anticon {
      margin-right: 5px;
    }
  }
`;
function MyStock(props) {
  const [state, dispatch] = useContext(store);
  // 선택(체크)한 종목 리스트
  const [selectedStock, setSelectedStock] = useState([]);
  // 그룹 추가 모달 열기/닫기
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors, register, handleSubmit, watch } = useForm({ mode: "all" });

  useEffect(() => {
    onGetBookmark();
  }, []);

  // 관심그룹 및 종목 조회
  const onGetBookmark = async () => {
    setLoading(true);
    const params = {
      id: state.user?.id,
    };

    await axios
      .post("/api/bookmark/read", params)
      .then((res) => {
        dispatch(getBookmark(res.data));
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetBookmark", error);
      });
  };

  // 관심그룹 추가
  const onAddGroup = async () => {
    const { groupName } = watch();

    const params = {
      id: state?.user.id,
      group_name: groupName,
    };

    await axios
      .post(`/api/bookmark/group_create`, params)
      .then((res) => {
        if (!res.error) {
          setOpenModal(false);
          onGetBookmark();
        }
      })
      .catch((error) => {
        console.log("onAddGroup", error);
      });
  };

  // 관심그룹 삭제
  const onDeleteGroup = async (groupKey) => {
    const params = {
      id: state.user?.id,
      idx: groupKey,
    };

    await axios
      .post("/api/bookmark/group_delete", params)
      .then((res) => {
        if (!res.error) {
          onGetBookmark();
        }
      })
      .catch((error) => {
        console.log("onDeleteGroup", error);
      });
  };

  // 관심종목 삭제
  const onDeleteStock = async () => {
    const params = {
      id: state.user?.id,
      idx: selectedStock.map((code) => Number(code)),
    };

    await axios
      .post("/api/bookmark/stock_delete", params)
      .then((res) => {
        if (!res.error) {
          onGetBookmark();
        }
      })
      .catch((error) => {
        console.log("onDeleteStock", error);
      });
  };

  // 테이블 항목
  const columns = [
    {
      title: "종목명",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "현재가",
      dataIndex: "price",
      key: "price",
      width: 200,
      align: "right",
      render: (value) => addComma(value),
    },
    {
      title: "전일대비",
      dataIndex: "dtd",
      key: "dtd",
      width: 200,
      align: "right",
      render: (value) => {
        let color = "";
        if (value) {
          color = value > 0 ? "red" : "blue";
        }
        return <div className={color}>{color === "red" ? `+${addComma(value)}` : addComma(value)}</div>;
      },
    },
    {
      title: "등락률",
      dataIndex: "rating",
      key: "rating",
      width: 200,
      align: "right",
      render: (value) => {
        let color = "";
        if (value) {
          color = value > 0 ? "red" : "blue";
        }
        return <div className={color}>{color === "red" ? `+${value}` : value}%</div>;
      },
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedStock(selectedRowKeys);
    },
  };

  return (
    <>
      <Loading loading={loading} />

      <MyStockStyled>
        <div className="add-btn-area">
          <button className="stock-btn" onClick={() => setOpenModal(true)}>
            <PlusOutlined style={{ color: " #fff" }} />
            그룹 추가
          </button>
        </div>
        {state.bookmark?.map((data, index) => {
          const tableData = [];
          data.values?.forEach((value) => {
            tableData.push({ key: value.idx, ...value });
          });

          return (
            <div className="group-item" key={index}>
              <div className="group-title">
                <span>{data.name}</span>
                <div className="group-btn">
                  <button className="stock-btn" onClick={onDeleteStock}>
                    <DeleteOutlined />
                    종목 삭제
                  </button>
                  <button className="stock-btn" onClick={() => onDeleteGroup(data.idx)}>
                    <DeleteOutlined />
                    그룹 삭제
                  </button>
                </div>
              </div>

              <CommonTable
                data={tableData}
                columns={columns}
                rowSelection={rowSelection}
                pagination={{ pageSize: 5 }}
              />
            </div>
          );
        })}
      </MyStockStyled>

      {openModal && (
        <Modal
          title="그룹 추가"
          visible={openModal}
          onOk={handleSubmit(onAddGroup)}
          onCancel={() => setOpenModal(false)}
          okText="추가"
          cancelText="취소"
          maskClosable={false}
          // centered
        >
          <form onSubmit={(e) => e.stopPropagation()} autoComplete="off">
            <div className="input-item">
              <div className="label">그룹명</div>
              <CommonInput
                type="text"
                name="groupName"
                error={errors.groupName}
                register={register}
                validation={{ validate: { required: (value) => validRequired(value) } }}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default MyStock;
