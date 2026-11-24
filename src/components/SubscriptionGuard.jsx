import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkSubscription } from "../utils/subscriptionGuard";
import { getCookie, setCookie, deleteCookie } from "../utils/cookie.js";

const SubscriptionGuard = () => {

    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const check = async () => {
            const result = await checkSubscription();
            if (result.expired) {
                setExpired(true);

            } else {
                setAllowed(result.allowed);
            }
            setLoading(false);
        };
        check();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}>

                <div className="text-center">

                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <p className="mt-3">
                        Checking subscription...
                    </p>

                </div>

            </div>
        );
    }

    // Session expired
    if (expired) {
        deleteCookie("_token");
        deleteCookie("_session_id");
        deleteCookie("_pre_session");
        deleteCookie("_brw_id");
        localStorage.clear();

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Not subscribed
    if (!allowed) {
        return (
            <Navigate
                to="/recruiter/subscription-plans"
                replace
                state={{
                    from: location.pathname
                }}
            />
        );
    }

    // Subscribed
    return <Outlet />;
};
export default SubscriptionGuard;