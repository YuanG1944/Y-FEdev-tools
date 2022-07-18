import React, { useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Typography, Switch } from 'antd';
import { getChromeStorage, setChromeStorage } from '../../utils';
import './index.less';

const { Title } = Typography;

const RequestHeader = () => {
  const [switchBtn, setWitchBtn] = useState(false);

  const handelSwitchChange = (checked) => {
    setWitchBtn(checked);
    setChromeStorage(
      '__y_fetools_requestHeaderStore',
      'checked',
      checked,
      '__y_fetools_requestHeaderStore set success'
    );
  };

  const getSwitchChange = async () => {
    const switchValue = await getChromeStorage(
      '__y_fetools_requestHeaderStore',
      'checked'
    );
    handelSwitchChange(switchValue);
  };

  useEffect(() => {
    getSwitchChange();
  }, []);
  return (
    <div className="request-header">
      <div className="request-header-contents">
        <Title level={3} type={switchBtn ? 'warning' : 'secondary'}>
          Request Header
        </Title>

        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={handelSwitchChange}
          checked={switchBtn}
        />
      </div>
    </div>
  );
};

export default RequestHeader;
