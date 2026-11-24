import { getSubscriptionTypes } from "../services/subscription";

export const checkSubscription = async () => {

    try {

        const response = await getSubscriptionTypes();

        console.log(
            "SUBSCRIPTION STATUS:",
            response
        );

        // Session expired
        if (
            response?.status === "expire" ||
            response?.httpStatus === 401
        ) {
            return {
                allowed: false,
                expired: true
            };
        }

        // API failure
        if (
            !response ||
            response.status !== "success"
        ) {
            return {
                allowed: false,
                expired: false
            };
        }

        const data = response.data || response;

        // API explicitly tells us whether company is subscribed
        if (data.subscribed === true) {

            return {
                allowed: true,
                expired: false,
                subscription: data.currentSubscription
            };
        }

        // subscribed = false
        return {
            allowed: false,
            expired: false,
            subscription: data.currentSubscription || null
        };

    } catch (error) {

        console.error(
            "SUBSCRIPTION CHECK ERROR:",
            error
        );

        return {
            allowed: false,
            expired: false
        };
    }
};