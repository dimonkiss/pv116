import HomePage from "./components/home/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import NoMatchPage from "./components/404/NoMatchPage.tsx";
import CategoryCreatePage from "./components/categories/create/CategoryCreatePage.tsx";




import { Menu } from 'antd';
import { Link } from 'react-router-dom';
const App = () => {
    return (
        <>

            <Menu mode="horizontal" theme="dark">
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="create">
                    <Link to="/categories/create">Create</Link>
                </Menu.Item>
                <Menu.Item key="404">
                    <Link to="/404">404</Link>
                </Menu.Item>
            </Menu>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="categories/create" element={<CategoryCreatePage />} />
                    <Route path="*" element={<NoMatchPage />} />
                </Route>
            </Routes>
        </>
    )
}
export default App