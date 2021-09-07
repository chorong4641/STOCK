import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import { store } from "../../store";
import CommonInput from "../common/CommonInput";
import { validRequired } from "../../utils/validation";
import Loading from "../Loading";
import CommonTable from "../common/CommonTable";

const DetailBoardStyled = styled.div`
  .add-contents {
    width: calc(100% - 300px);
    min-width: 500px;
    margin: 30px auto 10px;

    .board-row {
      display: flex;

      //   textarea {
      //     width: 100%;
      //     margin-right: 10px;
      //   }

      input {
        width: 100%;
        height: 45px;
        margin-right: 10px;
      }

      button {
        width: 100px;
      }
    }
  }
`;

function DetailBoard() {
  const [state, dispatch] = useContext(store);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const { register, watch, setValue, setError, handleSubmit, errors } = useForm();
  const watchValues = watch();

  useEffect(() => {
    onGetDetailBoard();
  }, [state.stock?.code]);

  // 종목토론 목록 조회
  const onGetDetailBoard = async () => {
    setLoading(true);
    setEditIdx(null);

    const params = {
      code: state.stock?.code,
    };

    await axios
      .post(`/api/board/read`, params)
      .then((res) => {
        setTableData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetDetailBoard", error);
      });
  };

  //  내용 등록
  const onAddBoard = async () => {
    // 입력 내용 없을 시 등록하지 않음
    if (!watchValues.addContents?.trim()) {
      return;
    }

    setLoading(true);

    const params = {
      code: state.stock?.code,
      contents: watchValues.addContents,
    };

    await axios
      .post(`/api/board/create`, params)
      .then((res) => {
        setValue("addContents", "");
        onGetDetailBoard();
        setLoading(false);
      })
      .catch((error) => {
        console.log("onAddBoard", error);
      });
  };

  //  내용 수정
  const onEditBoard = async (idx) => {
    // 입력 내용 없을 시 등록하지 않음
    if (!watchValues.contents?.trim()) {
      return;
    }

    setLoading(true);

    const params = {
      idx: idx,
      contents: watchValues.contents,
    };

    await axios
      .post(`/api/board/update`, params)
      .then((res) => {
        onGetDetailBoard();
        setEditIdx(null);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onEditBoard", error);
      });
  };

  //  내용 삭제
  const onDeleteBoard = async (idx) => {
    setLoading(true);

    const params = {
      idx: idx,
    };

    await axios
      .post(`/api/board/delete`, params)
      .then((res) => {
        onGetDetailBoard();
        setLoading(false);
      })
      .catch((error) => {
        console.log("onDeleteBoard", error);
      });
  };

  // 테이블
  const columns = [
    {
      title: <SettingOutlined />,
      dataIndex: "setting",
      key: "setting",
      width: 100,
      align: "center",
      render: (value, record) => {
        return (
          state.user?.id === record.id && (
            <div className="board-btns">
              {editIdx === record.idx ? (
                <>
                  <CheckOutlined onClick={() => onEditBoard(record.idx)} style={{ marginRight: 10 }} />
                  <CloseOutlined onClick={() => setEditIdx(null)} />
                </>
              ) : (
                <>
                  <EditOutlined onClick={() => setEditIdx(record.idx)} style={{ marginRight: 10 }} />
                  <DeleteOutlined onClick={() => onDeleteBoard(record.idx)} />
                </>
              )}
            </div>
          )
        );
      },
    },
    {
      title: "내용",
      dataIndex: "contents",
      key: "contents",
      ellipsis: true,
      render: (value, record) => {
        return editIdx === record.idx ? (
          <CommonInput
            type="text"
            name="contents"
            defaultValue={value}
            error={errors.contents}
            register={register}
            validation={{ validate: { required: (value) => validRequired(value) } }}
          />
        ) : (
          value
        );
      },
    },
    {
      title: "작성자",
      dataIndex: "id",
      key: "id",
      width: 150,
      align: "center",
    },
    {
      title: "등록일시",
      dataIndex: "date_insert",
      key: "date_insert",
      width: 200,
      align: "center",
      render: (value, record) => {
        return value.replace("T", " ");
      },
    },
    {
      title: "수정일시",
      dataIndex: "date_update",
      key: "date_update",
      width: 200,
      align: "center",
      render: (value, record) => {
        return value.replace("T", " ");
      },
    },
  ];

  return (
    <DetailBoardStyled>
      <Loading loading={loading} />

      <CommonTable data={tableData} columns={columns} pagination={false} />

      {/* 게시물 등록 */}
      <div className="add-contents">
        <div className={`board-row${state.user?.id ? "" : " disabled"}`}>
          <CommonInput
            style={{ width: "100%" }}
            // type="textarea"
            type="text"
            name="addContents"
            error={errors.addContents}
            register={register}
          />

          <button className="dark-bg" onClick={onAddBoard}>
            등록
          </button>
        </div>

        {/* 로그인 안내 문구 */}
        {!state.user?.id && <span className="error-message">로그인 후 내용 작성이 가능합니다.</span>}
      </div>
    </DetailBoardStyled>
  );
}

export default DetailBoard;
