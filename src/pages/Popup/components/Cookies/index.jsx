import React, { useEffect, useState } from 'react';
import { Collapse, Row, Col, Card, Empty, Checkbox, message } from 'antd';
import CookieDataForm from './CookieDataForm';
import CookieDrawer from './CookieDrawer';
import './index.less';

const { Panel } = Collapse;

const gridStyle = {
  width: '100%',
  textAlign: 'center',
};

const PanelChecked = ({ index, changeCheckStatus, cookieConfig }) => {
  const handleCheckboxChange = (e) => {
    changeCheckStatus(index, e.target.checked);
  };
  return (
    <Checkbox
      key={index}
      checked={cookieConfig.checked}
      onChange={handleCheckboxChange}
      className="y-cookies-contents-collapse-group-checkbox"
    />
  );
};

const Cookies = ({ showBtn }) => {
  const [cookiesList, setCookiesList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [currTabUrl, setCurrTabUrl] = useState('');
  const [colSpan, setColSpan] = useState({
    list: 20,
    btn: 4,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawStatus, setDrawSatus] = useState(null);

  const handelCookiesCheckList = (cookies) => {
    setCookiesList(
      cookies.map((val) => ({ cookieContens: val, checked: false }))
    );
  };

  const getCurrentTabCookies = async () => {
    const currTab = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (currTab && currTab?.length) {
      const { url } = currTab[0];
      setCurrTabUrl(url);
      const targetUrl = new URL(url);
      const allCookies = await chrome.cookies.getAll({
        url: targetUrl.origin,
      });
      console.log('allCookies-->', allCookies);
      handelCookiesCheckList(allCookies);
    }
  };

  const changeCheckStatus = (index, checkedStatus) => {
    const list = cookiesList;
    list[index].checked = checkedStatus;
    setCookiesList([...list]);
    setIndeterminate(false);
    if (list.every((item) => item.checked === true)) {
      setCheckAll(true);
    } else if (list.every((item) => item.checked === false)) {
      setCheckAll(false);
    } else {
      setIndeterminate(true);
    }
  };

  const onCheckAllChange = (e) => {
    // 取消
    if (checkAll === true) {
      setCookiesList(cookiesList.map((item) => ({ ...item, checked: false })));
    }
    // 全选
    if (checkAll === false) {
      setCookiesList(cookiesList.map((item) => ({ ...item, checked: true })));
    }
    setCheckAll(e.target.checked);
    setIndeterminate(false);
  };

  const onExport = async () => {
    const exportList = cookiesList.filter((item) => item.checked === true);
    if (exportList.length === 0) {
      message.warning('Choose at least one!');
      return;
    }
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(exportList.map((item) => item.cookieContens))
      );
      message.success('Export success!');
    } catch (e) {
      message.error('Export failed!');
    }
  };

  const onDelete = async () => {
    const exportList = cookiesList.filter((item) => item.checked === true);
    if (exportList.length === 0) {
      message.warning('Choose at least one!');
      return;
    }
    const targetUrl = new URL(currTabUrl);
    for (let i = 0; i < exportList.length; i++) {
      const c = exportList[i];
      const deleteLog = await chrome.cookies.remove({
        url: targetUrl.origin,
        name: c.cookieContens.name,
      });
      console.log('deleteLog-->', deleteLog);
    }
    console.log('delete finish');
    getCurrentTabCookies();
  };

  const onImport = () => {
    setDrawerVisible(true);
    setDrawSatus('IMPORT');
  };

  const onAdd = () => {
    setDrawerVisible(true);
    setDrawSatus('ADD');
  };

  useEffect(() => {
    getCurrentTabCookies();
  }, []);

  useEffect(() => {
    showBtn
      ? setColSpan({
          list: 20,
          btn: 4,
        })
      : setColSpan({
          list: 24,
          btn: 0,
        });
  }, [showBtn]);

  const closeDrawer = (flag) => {
    setDrawerVisible(flag);
  };

  const refresh = (flag) => {
    if (flag) {
      getCurrentTabCookies();
    }
  };

  const updateSigleCookie = async (index, value) => {
    try {
      const response = await chrome.cookies.set(value);
      console.log('updateSigleCookie-->', response);
      message.success('update success');
    } catch (e) {
      console.log(e);
      message.error('update failed');
    }

    getCurrentTabCookies();
  };

  return (
    <div className="y-cookies">
      <Row>
        <Col span={colSpan.list}>
          <div className="y-cookies-contents">
            {cookiesList.length ? (
              <Collapse accordion>
                {cookiesList.map((cookieConfig, index) => {
                  return (
                    <Panel
                      header={cookieConfig?.cookieContens?.name || ''}
                      key={`${
                        cookieConfig?.cookieContens?.name || ''
                      }-${index}`}
                      collapsible="header"
                      extra={
                        <PanelChecked
                          index={index}
                          changeCheckStatus={changeCheckStatus}
                          key={cookieConfig.cookieContens.name}
                          cookieConfig={cookieConfig}
                        />
                      }
                    >
                      <CookieDataForm
                        cookie={cookieConfig.cookieContens}
                        index={index}
                        updateSigleCookie={updateSigleCookie}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </Col>

        <Col span={colSpan.btn}>
          <div className="y-cookies-checkall">
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Pick All
            </Checkbox>
          </div>

          <Card className="y-cookies-toolbar">
            <Card.Grid
              style={gridStyle}
              className="y-cookies-toolbar-tool"
              onClick={onExport}
            >
              EXPORT
            </Card.Grid>
            <Card.Grid
              style={gridStyle}
              className="y-cookies-toolbar-tool"
              onClick={onImport}
            >
              IMPORT
            </Card.Grid>
            <Card.Grid
              style={gridStyle}
              className="y-cookies-toolbar-tool"
              onClick={onAdd}
            >
              ADD
            </Card.Grid>
            <Card.Grid
              style={gridStyle}
              className="y-cookies-toolbar-tool"
              onClick={onDelete}
            >
              DELETE
            </Card.Grid>
          </Card>
        </Col>
      </Row>
      <CookieDrawer
        drawerVisible={drawerVisible}
        closeDrawer={closeDrawer}
        drawStatus={drawStatus}
        currTabUrl={currTabUrl}
        refresh={refresh}
        getCurrentTabCookies={getCurrentTabCookies}
      />
    </div>
  );
};

export default Cookies;
