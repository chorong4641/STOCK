import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Loading from "./Loading";

const WordStyled = styled.div`
  width: 80%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  color: #3f4753;

  .word-info {
    width: 80%;
    max-height: 450px;
    margin-top: 100px;
    padding: 15px 10px 10px;
    border-radius: 5px;

    .word-title {
      margin-bottom: 10px;
      padding: 0 10px;
      font-size: 16px;
      font-weight: 700;
      background-color: #fff;

      .word-icon {
        position: relative;
        top: 1px;
        display: inline-block;
        margin-right: 5px;
        color: #9d141d;
      }
    }

    .word-content {
      height: 100%;
      overflow-y: auto;

      .word-row {
        display: inline-block;
        margin: 5px;
        padding: 7px 10px;
        background-color: #3f47530d;
        border-radius: 3px;
        font-size: 14px;

        .word-text {
          font-weight: 700;
        }

        .word-mean {
          margin-top: 5px;
        }
      }
    }
  }
`;

const InputStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 50%;
  height: 50px;
  margin: 10px auto 30px;

  input {
    height: 50px;
    padding-right: 40px;
    font-size: 16px;
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
    cursor: pointer;
  }
`;

function Word() {
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    onGetWord();
  }, []);

  // 자주 찾는 용어 조회
  const onGetWord = async () => {
    setLoading(true);

    await axios
      .get(`api/word/stockword`)
      .then((res) => {
        setLoading(false);
        setWordData(res.data);
      })
      .catch((error) => {
        console.log("onGetWord", error);
      });
  };

  // 용어 입력 시
  const onChangeWord = (e) => {
    setSearchText(e.target.value);
  };

  // 용어 검색 수행
  const onSearchWord = () => {
    // 새 탭에서 위키백과로 연결
    window.open(`https://ko.wikipedia.org/wiki/${searchText}`);
  };

  return (
    <WordStyled>
      <Loading loading={loading} />

      <InputStyled>
        <Input placeholder="용어 검색" onChange={onChangeWord} onPressEnter={onSearchWord} />
        <div className="search-icon" onClick={onSearchWord}>
          <SearchOutlined />
        </div>
      </InputStyled>

      <div className="word-info">
        <div className="word-title">
          <div className="word-icon">
            <SearchOutlined />
          </div>
          자주 찾는 용어
        </div>
        <div className="word-content">
          {wordData?.map((data) => {
            return (
              <div className="word-row">
                <div className="word-text">#{data.word}</div>
                <div className="word-mean">{data.mean}</div>
              </div>
            );
          })}
        </div>
      </div>
    </WordStyled>
  );
}

export default Word;
