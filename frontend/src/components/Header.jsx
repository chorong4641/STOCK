import { UserOutlined } from "@ant-design/icons";
import { Divider, Popover } from "antd";
import Modal from "antd/lib/modal/Modal";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
import { store } from "../store";
import { editUser, logout, selectStock } from "../store/actions";
import { validEmail, validRequired } from "../utils/validation";
import CommonInput from "./common/CommonInput";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  // background-color: #3f4753;
  box-shadow: rgb(0 0 0 / 8%) 0px 0px 8px;

  .logo-area {
    position: absolute;
    left: 30px;

    .logo-text {
      position: relative;
      top: 4px;
      margin-left: 3px;
      color: #3f4753;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: -1px;
    }
  }

  .user-icon {
    position: absolute;
    right: 30px;
    padding: 8px;
    background-color: #e9e9eb;
    border-radius: 100%;
    font-size: 16px;
  }
`;

const NavStyled = styled.div`
  width: 50%;
  height: 46px;
  min-width: 512px;
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #3f4753;
    font-weight: 700;
    text-decoration: none;

    &:hover,
    &.active {
      box-shadow: 0 3px 0 #9d141d;
    }
  }
`;

const LoginBtn = styled.button`
  position: absolute;
  right: 30px;
  padding: 3px 10px;
  background-color: #9d141d;

  a {
    color: #fff !important;
  }
`;

const UserPopoverStyled = styled.div`
  font-size: 13px;

  .info-title {
    padding-bottom: 10px;
    color: #3f4753;
    font-weight: normal;
    border-bottom: 1px solid #ddd;

    span {
      font-weight: bold;
    }
  }

  .edit-user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    font-size: 12px;
    cursor: pointer;
  }
`;

function Header(params) {
  const history = useHistory();
  const [state, dispatch] = useContext(store);
  const [openModal, setOpenModal] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const { errors, register, handleSubmit } = useForm({ mode: "all" });

  // 로그아웃
  const onLogout = async () => {
    await dispatch(selectStock(null));
    await dispatch(logout());
    history.push("/stock");
  };

  // 내 정보 수정
  const onEditUserInfo = async (formData) => {
    const params = {};
    Object.keys(formData).forEach((key) => {
      if (state.user[key] !== formData[key]) {
        params[key] = formData[key];
      }
    });
    
    await axios
      .post(`/api/user/edit`, params)
      .then((res) => {
        if (!res?.data?.error) {
          dispatch(editUser(params));
        }
        setOpenModal(false);
      })
      .catch((error) => {
        console.log("onEditUserInfo", error);
      });
  };

  return (
    <>
      <HeaderStyled>
        <div className="logo-area">
          <img src="/img/logo.png" alt="logo" />
          <span className="logo-text">Easy Stock</span>
        </div>

        <NavStyled>
          <NavLink to="/stock" activeClassName="active">
            홈
          </NavLink>
          {/* <NavLink to="/recommend" activeClassName="active">
          추천종목
        </NavLink> */}
          <NavLink to="/news" activeClassName="active">
            뉴스
          </NavLink>
          <NavLink to="/word" activeClassName="active">
            용어검색
          </NavLink>
          <NavLink to="/mystock" activeClassName="active">
            관심종목
          </NavLink>
        </NavStyled>
        {state.user ? (
          <Popover
            placement="bottomRight"
            content={
              <UserPopoverStyled>
                <div className="info-title">
                  <span>{state.user?.id}</span>님 환영합니다!
                </div>
                <div className="edit-user-info">
                  <div
                    onClick={() => {
                      setOpenModal(true);
                      setInfoVisible(false);
                    }}
                  >
                    내 정보 수정
                  </div>
                  <Divider type="vertical" style={{ borderColor: "#ddd" }} />
                  <div onClick={onLogout}>로그아웃</div>
                </div>
              </UserPopoverStyled>
            }
            trigger="click"
            visible={infoVisible}
            onVisibleChange={(visible) => setInfoVisible(visible)}
            arrowPointAtCenter
          >
            <UserOutlined className="user-icon" />
          </Popover>
        ) : (
          <LoginBtn>
            <NavLink to="/login" activeClassName="active">
              로그인
            </NavLink>
          </LoginBtn>
        )}
      </HeaderStyled>

      {openModal && (
        <Modal
          title="내 정보 수정"
          visible={openModal}
          onOk={handleSubmit(onEditUserInfo)}
          onCancel={() => setOpenModal(false)}
          okText="수정"
          cancelText="취소"
          maskClosable={false}
        >
          <form onSubmit={(e) => e.stopPropagation()} autoComplete="off">
            <div className="input-item">
              <div className="label">아이디</div>
              <CommonInput
                type="text"
                name="id"
                defaultValue={state.user?.id}
                error={errors.id}
                register={register}
                validation={{ validate: { required: (value) => validRequired(value) } }}
                disabled
              />
            </div>
            <div className="input-item">
              <div className="label">이름</div>
              <CommonInput
                type="text"
                name="name"
                defaultValue={state.user?.name}
                error={errors.name}
                register={register}
                validation={{ validate: { required: (value) => validRequired(value) } }}
              />
            </div>
            <div className="input-item">
              <div className="label">이메일</div>
              <CommonInput
                type="text"
                name="email"
                defaultValue={state.user?.email}
                error={errors.email}
                register={register}
                validation={{
                  validate: { required: (value) => validRequired(value), email: (value) => validEmail(value) },
                }}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Header;
