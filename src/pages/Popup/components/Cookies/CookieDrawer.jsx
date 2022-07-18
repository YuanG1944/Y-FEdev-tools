import React, { useState } from 'react';
import { Drawer, Input, Button, message } from 'antd';
import { refresh } from 'less';
import CookieDataForm from './CookieDataForm';
import { useEffect } from 'react';

const { TextArea } = Input;

const cookieTemplate = {
  domain: '',
  expirationDate: '',
  hostOnly: false,
  httpOnly: false,
  name: '',
  path: '',
  sameSite: '',
  secure: false,
  session: false,
  value: '',
};

const DrawerContents = ({
  drawStatus,
  refresh,
  isEdit,
  getCurrentTabCookies,
  currTabUrl,
}) => {
  const [importValue, setImportValue] = useState('');

  const handleImportValue = (e) => {
    setImportValue(e.target.value);
  };

  const sendMessageToContentScript = (message, callback) => {
    const queryInfo = {
      active: true,
      currentWindow: true,
    };
    chrome.tabs.query(queryInfo, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        if (callback) callback(response);
      });
    });
  };

  const handleImportCookies = () => {
    if (!importValue) {
      message.warning('Please enter cookies List!');
      return;
    }
    try {
      const importCookies = JSON.parse(importValue);
      sendMessageToContentScript({ cookies: importCookies }, (msg) => {
        if (msg === 'success') {
          message.success('Import cookies success!');
        } else {
          message.error('Import cookies failed!');
        }
        refresh(true);
        setImportValue('');
      });
    } catch (e) {
      message.error('Please enter correct format');
    }
  };

  const updateSigleCookie = async (index, value) => {
    try {
      const response = await chrome.cookies.set(value);
      console.log('updateSigleCookie-->', response);
      message.success('update success');
    } catch (e) {
      console.log(e);
      message.error(`update failed: ${e || 'error'}`);
    }

    getCurrentTabCookies();
  };

  switch (drawStatus) {
    case 'IMPORT':
      return (
        <>
          <TextArea
            rows={20}
            value={importValue}
            onChange={handleImportValue}
            placeholder="Enter Cookies List (JSON FORMAT)"
            className="cookie-drawer-textarea"
            style={{
              marginBottom: '20px',
            }}
          />
          <div className="cookie-drawer-btn">
            <Button type="primary" onClick={handleImportCookies}>
              Import
            </Button>
          </div>
        </>
      );
    case 'ADD':
      return (
        <>
          <CookieDataForm
            cookie={cookieTemplate}
            updateSigleCookie={updateSigleCookie}
            currTabUrl={currTabUrl}
            index={0}
            isEdit={isEdit}
          />
        </>
      );
    default:
      return <></>;
  }
};

const CookieDrawer = ({
  drawerVisible,
  closeDrawer,
  drawStatus,
  refresh,
  currTabUrl,
}) => {
  const onClose = () => {
    closeDrawer(false);
  };

  useEffect(() => {
    console.log('drawerVisible-->', drawerVisible);
  }, [drawerVisible]);

  return (
    <>
      <Drawer
        title={drawStatus}
        getContainer={false}
        placement="left"
        onClose={onClose}
        visible={drawerVisible}
        className="cookie-drawer"
        width={480}
      >
        <DrawerContents
          drawStatus={drawStatus}
          refresh={refresh}
          currTabUrl={currTabUrl}
          isEdit={true}
        />
      </Drawer>
    </>
  );
};

export default CookieDrawer;
