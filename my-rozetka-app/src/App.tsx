
import HomePage from "./components/home/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import NoMatchPage from "./components/404/NoMatchPage.tsx";
import CategoryCreatePage from "./components/categories/create/CategoryCreatePage.tsx";





import CategoryEditPage from "./components/categories/edit/CategoryEditPage.tsx";
import RegisterPage from "./components/auth/register/RegisterPage.tsx";
import LoginPage from "./components/auth/login/LoginPage.tsx";
import DefaultHeader from "./containers/default/DefaultHeader.tsx";



const App = () => {
    return (
        <>

            <DefaultHeader />
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="categories/create" element={<CategoryCreatePage />} />
                    <Route path="*" element={<NoMatchPage />} />
                    <Route path="categories/edit/:id" element={<CategoryEditPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="login" element={<LoginPage />} />
                </Route>
            </Routes>
        </>
    )
}
export default App