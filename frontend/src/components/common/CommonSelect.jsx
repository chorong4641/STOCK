import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import styled from "styled-components";
import { store } from "../../store";
import { selectStock } from "../../store/actions";

const SelectStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 30px auto;

  .ant-select {
    width: 100%;

    &.ant-select-focused {
      .ant-select-selector {
        border-color: #3f4753 !important;
        box-shadow: none !important;
      }
    }

    &:hover {
      border-color: #3f4753;

      .ant-select-selector {
        border-color: inherit;
        box-shadow: none;
      }
    }

    .ant-select-selector {
      height: 45px;
      line-height: 43px;
      padding-right: 45px;

      input {
        height: 100%;
        padding-right: 35px;
      }

      .ant-select-selection-item,
      .ant-select-selection-placeholder {
        line-height: inherit;
      }
    }
  }

  .search-icon {
    position: absolute;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
    color: #3f4753;
    font-size: 18px;
  }
`;

function CommonSelect({ onAfterSelect, onSearch, placeholder, showArrow, filterOption, ...rest }) {
  // 검색한 종목과 일치하는 데이터(종목명, 코드)
  const [searchData, setSearchData] = useState([]);
  const history = useHistory();
  const [state, dispatch] = useContext(store);

  const { Option } = Select;

  // 종목명 입력 이벤트
  const onChangeSearch = (value) => {
    // setSearchText(value);

    if (value) {
      onGetMatchedStock(value);
    }
  };

  // 검색 문자열과 일치하는 주식 리스트 조회
  const onGetMatchedStock = async (value) => {
    if (!value) return;

    await axios
      .get(`/api/searchstock/${value}`)
      .then((res) => {
        setSearchData(res.data);
      })
      .catch((error) => {
        console.log("onGetMatchedStock", error);
      });
  };

  // 검색한 종목 선택 이벤트
  const onSelect = async (value) => {
    const selectInfo = searchData?.filter((data) => data.code === value)[0];
    if (selectInfo) {
      await dispatch(selectStock(selectInfo));

      // 종목 선택 후 이벤트
      if (onAfterSelect) {
        onAfterSelect(value);
      }
    }
  };

  // 종목 드롭다운 리스트
  const stockDropdown = searchData?.map((data) => <Option key={data.code}>{data.name}</Option>);

  return (
    <SelectStyled>
      <Select
        showSearch
        // value={searchText || null}
        placeholder={placeholder}
        // defaultActiveFirstOption={false}
        showArrow={showArrow || false}
        filterOption={filterOption || false}
        onSearch={onSearch || onChangeSearch}
        onChange={onSelect}
        notFoundContent="검색 결과가 없습니다."
      >
        {stockDropdown}
      </Select>
      <div className="search-icon">
        <SearchOutlined />
      </div>
    </SelectStyled>
  );
}

export default CommonSelect;
