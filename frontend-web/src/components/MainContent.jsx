import { Outlet } from "react-router-dom";

function MainContent() {
    return (
        <>
        <main id="main-content">
            <Outlet/>
        </main>
        </>

    )
}

export default MainContent;