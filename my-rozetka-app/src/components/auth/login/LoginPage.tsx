

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {ILogin, ILoginForm} from "../types.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const onFinish = async (values: ILoginForm) => {
        const model: ILogin = {
            ...values
        };
        console.log("Login model", model);

        try {
            const response = await axios.post("http://pv116.rozetka.com/api/login", model);

            // Assuming your server responds with a 'token' property
            const token = response.data.token;

            // Store the token in local storage
            localStorage.setItem('token', token);

            console.log("Token:", token);
            navigate("/"); // Redirect to the desired page
        } catch (ex) {
            console.error('Помилка при вході!');
        }
    };

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <a href="http://localhost:5173/register">register now!</a>
            </Form.Item>
        </Form>
    );
};

export default LoginPage;