import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Loading from "./Loading";
import { RightOutlined } from "@ant-design/icons";

const NewsStyled = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  padding: 30px 0;

  .news-item {
    width: 30%;
    min-width: 250px;
    margin: 0 20px;
    border-radius: 5px;
    border: 1px solid #3f47530d;
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 5%);

    .news-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 10px;
      background-color: #3f47530d;
      font-size: 15px;
      font-weight: 700;

      .news-more {
        font-size: 11px;
        color: #3f4753;
      }
    }

    .news-list {
      padding: 10px;

      .news-row {
        display: flex;
        padding: 5px 0;
        border-bottom: 1px solid #3f47530d;

        &:last-child {
          border-bottom: none;
        }

        img {
          width: 110px;
          height: 70px;
          margin-top: 3px;
          border-radius: 5px;
        }

        .no-img {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 3px;
          width: 110px;
          height: 70px;
          color: #3f47533d;
          background-color: #3f47530d;
          border-radius: 5px;
        }

        .right {
          width: calc(100% - 100px);
          padding-left: 15px;

          .news-headline {
            line-height: 1.4;
            font-size: 15px;
            font-weight: bold;
          }

          .news-content {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            width: 100%;
            white-space: normal;
            line-height: 1.3em;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 5px 0 3px;
            color: #666;
          }

          .news-date {
            color: #888;
            font-size: 12px;
          }
        }
      }
    }
  }
`;

function News() {
  const [loading, setLoading] = useState(false);
  const [heraldnews, setHeraldnews] = useState({});
  const [ytnnews, setYtnnews] = useState({});
  const [joongangnews, setJoongangnews] = useState({});

  useEffect(() => {
    onGetHeraldNews();
    onGetYtnNews();
    onGetJoongangNews();
  }, []);

  // 헤럴드 뉴스 조회
  const onGetHeraldNews = async () => {
    setLoading(true);

    await axios
      .get(`api/news/heraldnews`)
      .then((res) => {
        setHeraldnews(res.data);
      })
      .catch((error) => {
        console.log("onGetHeraldNews", error);
      });
  };

  // ytn 뉴스 조회
  const onGetYtnNews = async () => {
    setLoading(true);

    await axios
      .get(`api/news/ytnnews`)
      .then((res) => {
        setYtnnews(res.data);
      })
      .catch((error) => {
        console.log("onGetYtnNews", error);
      });
  };

  // 중앙일보 뉴스 조회
  const onGetJoongangNews = async () => {
    setLoading(true);

    await axios
      .get(`api/news/joongangnews`)
      .then((res) => {
        setJoongangnews(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("onGetJoongangNews", error);
      });
  };

  // 뉴스 데이터 통합
  const newsData = {
    heraldnews: { url: "http://biz.heraldcorp.com/list.php?ct=010104000000", title: "헤럴드경제", data: heraldnews },
    ytnnews: { url: "https://www.ytn.co.kr/news/list.php?mcd=0102", title: "YTN", data: ytnnews },
    joongangnews: {
      url: "https://news.joins.com/money?cloc=joongang-section-gnb3",
      title: "중앙일보",
      data: joongangnews,
    },
  };

  return (
    <NewsStyled>
      <Loading loading={loading} />
      {newsData &&
        Object.keys(newsData)?.map((key) => {
          return (
            <div className="news-item" key={key}>
              <div className="news-title">
                {newsData[key].title}
                <a className="news-more" href={newsData[key].url} target="blank">
                  더보기
                  <RightOutlined />
                </a>
              </div>
              <div className="news-list">
                {newsData[key].data.length > 0 &&
                  newsData[key].data.map((news, index) => {
                    if (index < 6) {
                      return (
                        <a href={news.href} target="blank" className="news-row" key={news.title}>
                          {news.img ? <img src={news.img} alt="thumb" /> : <div className="no-img">no-image</div>}
                          <div className="right">
                            <div className="news-headline">{news.title}</div>
                            <div className="news-content">{news.text}</div>
                            <div className="news-date">{news.date}</div>
                          </div>
                        </a>
                      );
                    }
                    return <></>;
                  })}
              </div>
            </div>
          );
        })}
    </NewsStyled>
  );
}

export default News;
