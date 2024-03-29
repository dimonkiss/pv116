// DefaultHeader.jsx
import { Layout, Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IAuthReducerState } from '../../components/auth/login/AuthReducer.ts';
import { AuthReducerActionType } from '../../components/auth/login/AuthReducer.ts';
import './DefaultHeader.css'; // Import the CSS file for styling

const { Header } = Layout;

const DefaultHeader = () => {
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((redux: any) => redux.auth as IAuthReducerState);

    const handleLogout = () => {
        dispatch({ type: AuthReducerActionType.LOGOUT_USER });
        console.log('Logging out user');
    };

    const menuItems = [
        { key: 'home', label: 'Головна', link: '/' },
        { key: 'create', label: 'Створити', link: '/categories/create' },
        { key: 'register', label: 'Реєстрація', link: '/register' },
        {
            key: 'login',
            label: isAuth ? `Вихід (${user?.email})` : 'Вхід',
            link: isAuth ? '/' : '/login',
        },
    ];

    const handleItemClick = (key: string) => {
        console.log(`Clicked on ${key} link`);
        if (key === 'login' && isAuth) {
            handleLogout();
        }
    };

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            {isAuth && user?.image && (
                <Avatar
                    src={user.image}
                    alt="User Avatar"
                    className="user-avatar"
                    size={40}
                    shape="circle"
                />
            )}
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['home']}
                style={{ flex: 1, minWidth: 0 }}
                onClick={({ key }) => {
                    handleItemClick(key as string);
                }}
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
