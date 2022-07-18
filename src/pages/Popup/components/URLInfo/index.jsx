import React, { useEffect, useState } from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import URLInfoItem from './URLInfoItem';
import './index.less';

const URLInfo = ({ showBtn }) => {
  const [urlList, setUrlList] = useState([]);
  const addUrlList = () => {
    const list = [
      ...urlList,
      {
        targetUrl: '',
        currUrl: '',
      },
    ];
    setUrlList(list);
    chrome.storage.sync.set(
      {
        __y_fetools_urlStore: list,
      },
      (res) => {
        console.log('set successed!');
      }
    );
  };
  const changeUrlList = (list) => {
    setUrlList(list);
    chrome.storage.sync.set(
      {
        __y_fetools_urlStore: list,
      },
      (res) => {
        console.log('set successed!');
      }
    );
  };

  useEffect(() => {
    chrome.storage.sync.get(['__y_fetools_urlStore'], (store) => {
      if (store && store.hasOwnProperty('__y_fetools_urlStore')) {
        setUrlList(store['__y_fetools_urlStore']);
      }
      console.log(store);
    });
  }, []);
  return (
    <div className="url-info">
      {urlList.length ? (
        urlList.map((item, index) => {
          return (
            <URLInfoItem
              showBtn={showBtn}
              key={`${index}-${item.targetUrl}`}
              index={index}
              urlList={urlList}
              changeUrlList={changeUrlList}
            />
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      <div className="url-info-add-button">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={addUrlList}
        />
      </div>
    </div>
  );
};

export default URLInfo;
