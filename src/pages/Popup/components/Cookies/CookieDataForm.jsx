import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Checkbox } from 'antd';

const CookieDataForm = ({
  cookie,
  index,
  updateSigleCookie,
  isEdit,
  currTabUrl,
}) => {
  const [form] = Form.useForm();
  const [cookieKeysString] = useState([
    'name',
    'value',
    'path',
    'domain',
    'expirationDate',
    'sameSite',
  ]);
  const [cookieKeysBoolean] = useState([
    'hostOnly',
    'httpOnly',
    'secure',
    'session',
  ]);

  const handleCookieFormat = () => {
    const format = {
      CookieChecked: [],
    };
    for (let item in cookie) {
      if (cookieKeysString.includes(item)) {
        format[item] = cookie[item];
      }
      if (cookieKeysBoolean.includes(item)) {
        if (cookie[item] === true) {
          format.CookieChecked.push(item);
        }
      }
    }
    form.setFieldsValue(format);
  };

  const handleUpdateValue = (fieldsValue) => {
    const res = {};
    for (let i in fieldsValue) {
      if (i === 'CookieChecked') {
        const checkArr = fieldsValue[i] || [];
        cookieKeysBoolean.forEach((b) => {
          res[b] = checkArr.includes(b);
        });
      } else {
        if (fieldsValue[i]) {
          if (i === 'expirationDate') {
            res[i] = Number(fieldsValue[i]) || 0;
          } else {
            res[i] = fieldsValue[i];
          }
        }
      }
    }
    console.log('res-->', res);
    const keys = Object.keys(res);
    keys.forEach((val) => {
      !res[val] && delete res[val];
    });
    delete res.hostOnly;
    delete res.session;
    const url = new URL(currTabUrl);
    return { ...res, url: url.origin };
  };

  const onFinish = (fieldsValue) => {
    const updateValue = handleUpdateValue(fieldsValue);
    console.log('fieldsValue-->', index, updateValue);
    updateSigleCookie(index, updateValue);
  };

  useEffect(() => {
    handleCookieFormat();
  }, [cookie]);

  return (
    <Form layout={'vertical'} form={form} onFinish={onFinish}>
      {cookieKeysString.map((item) => {
        return (
          <Form.Item
            label={item}
            rules={[
              {
                required: ['name', 'value'].includes(item),
                message: `Please enter ${item}`,
              },
            ]}
            name={item}
            key={`${item}-${index}`}
          >
            <Input placeholder="please enter" allowClear />
          </Form.Item>
        );
      })}
      <Form.Item
        label={'CookieChecked'}
        name={'CookieChecked'}
        key={'CookieChecked'}
      >
        <Checkbox.Group>
          {cookieKeysBoolean.map((item, index) => {
            return (
              <Checkbox
                key={`${item}-${index}`}
                value={item}
                style={{ lineHeight: '32px' }}
              >
                {item}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </Form.Item>

      {isEdit ? (
        <Form.Item wrapperCol={{ span: 24, offset: 19 }}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      ) : (
        <></>
      )}
    </Form>
  );
};

export default CookieDataForm;
