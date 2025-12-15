import { Outlet } from "react-router-dom";

function MainContent() {
    return (
        <>
        <main id="main-content" className="app-container">
            <Outlet/>
        </main>
        </>

    )
}

export default MainContent;