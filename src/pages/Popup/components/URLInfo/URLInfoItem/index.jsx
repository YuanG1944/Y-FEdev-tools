import React, { useState } from 'react';
import { Row, Col, Input, Card, Button, Space, message, Tooltip } from 'antd';
import { MinusOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons';

const URLInfoItem = ({ showBtn, index, urlList, changeUrlList }) => {
  const [targetUrlStatus, setTargetUrlStatus] = useState(null);
  const [currUrlStatus, setCurrUrlStatus] = useState(null);

  const deleteList = () => {
    changeUrlList(urlList.filter((_, idx) => idx !== index));
  };

  const changeTargetUrl = (e) => {
    const { value } = e.target;
    const list = urlList.map((url, idx) => {
      if (idx === index) {
        return {
          ...url,
          targetUrl: value,
        };
      }
      return url;
    });
    changeUrlList(list);
  };

  const changeCurrentUrl = (e) => {
    const { value } = e.target;
    const list = urlList.map((url, idx) => {
      if (idx === index) {
        return {
          ...url,
          currUrl: value,
        };
      }
      return url;
    });
    changeUrlList(list);
  };

  const sentMessageToBackGround = (message) => {
    console.log('message-->', message);
    chrome.runtime.sendMessage(message, (res) => {
      console.log('我是 content.js ,我收到消息：', res);
    });
  };

  const openTargetUrl = () => {
    const { targetUrl, currUrl } = urlList[index];
    if (targetUrl === '') {
      setTargetUrlStatus('error');
      message.error('Please fill in the domain name!');
      setTimeout(() => {
        setTargetUrlStatus(null);
      }, 3000);
      return;
    }
    if (currUrl === '') {
      setCurrUrlStatus('error');
      message.error('Please fill in the current url!');
      setTimeout(() => {
        setCurrUrlStatus(null);
      }, 3000);
      return;
    }
    try {
      const currUrlValue = new URL(currUrl);
      sentMessageToBackGround({
        __urlTabs: {
          isurlTabs: true,
          currUrlValue: {
            search: currUrlValue.search,
            pathname: currUrlValue.pathname,
            origin: currUrlValue.origin,
          },
          targetDomain: targetUrl,
        },
      });
    } catch (e) {
      setCurrUrlStatus('error');
      message.error('Please enter the correct url!');
      setTimeout(() => {
        setCurrUrlStatus(null);
      }, 3000);
    }
  };

  return (
    <>
      <Card
        className="url-info-contents"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <div className="url-info-contents-groups">
          <Input
            defaultValue={urlList[index].targetUrl}
            onBlur={changeTargetUrl}
            placeholder="Target Domain Name"
            status={targetUrlStatus}
            style={{ width: showBtn ? '80%' : '100%' }}
            allowClear
          />

          <div className="url-info-contents-groups-swap-icon">
            <SwapOutlined />
          </div>

          <Input
            defaultValue={urlList[index].currUrl}
            onBlur={changeCurrentUrl}
            placeholder="Current URL"
            status={currUrlStatus}
            style={{ width: '100%' }}
            allowClear
          />

          <div className="url-info-contents-groups-button-groups">
            {showBtn ? (
              <Col span={2}>
                <Row justify="end">
                  <Col span={12}>
                    <Space>
                      <Tooltip placement="top" title={'Delete'}>
                        <Button
                          type="primary"
                          size="small"
                          danger
                          icon={<MinusOutlined />}
                          onClick={deleteList}
                        />
                      </Tooltip>
                      <Tooltip placement="top" title={'Direction'}>
                        <Button
                          type="primary"
                          size="small"
                          icon={<RightOutlined />}
                          onClick={openTargetUrl}
                        />
                      </Tooltip>
                    </Space>
                  </Col>
                </Row>
              </Col>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default URLInfoItem;
