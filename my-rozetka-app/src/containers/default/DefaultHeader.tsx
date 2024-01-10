import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IAuthReducerState } from '../../components/auth/login/AuthReducer.ts';

const { Header } = Layout;

const DefaultHeader = () => {
    const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);

    const menuItems = [
        { key: 'home', label: 'Home', link: '/' },
        { key: 'create', label: 'Create', link: '/categories/create' },
        { key: '404', label: '404', link: '/404' },
        { key: 'register', label: 'Register', link: '/register' },
        {
            key: 'login',
            label: isAuth ? `Вихід (${user?.email})` : 'Вхід',
            link: isAuth ? '/' : '/login',
        },
    ];

    const handleItemClick = (key: string) => {
        console.log(`Clicked on ${key} link`);
        if (key === 'login' && isAuth) {
            // Handle logout logic
            console.log('Logging out user');
        }
    };

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['home']}
                style={{ flex: 1, minWidth: 0 }}
                onClick={({ key }) => handleItemClick(key as string)}
            >
                {menuItems.map((item) => (
                    <Menu.Item key={item.key}>
                        <Link to={item.link}>{item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </Header>
    );
};

export default DefaultHeader;
