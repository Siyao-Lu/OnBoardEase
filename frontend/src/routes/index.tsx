import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Landing = React.lazy(() => import("../pages/landing"));
const Home = React.lazy(() => import("../pages/home"));

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;

