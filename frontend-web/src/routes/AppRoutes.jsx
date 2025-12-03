import { Route, Routes } from "react-router-dom";
import MainContent from "../components/MainContent";
import Home from "../pages/Home";
function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainContent/>}>
                    <Route index element={<Home/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;