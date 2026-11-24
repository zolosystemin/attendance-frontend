import api from "./api";

export const getSubscriptionTypes = async () => {
    try {
        const response = await api.get(
            "/company/subscription/type"
        );

        return response.data;

    } catch (error) {
        console.error(
            "GET SUBSCRIPTION TYPES ERROR",
            error
        );

        if (error.response) {

            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (error.response.status === 401 || error.response.status === 403) {
                return {
                    status: "expire",
                    httpStatus: 401,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const redeemCoupon = async ({
    couponCode,
    planName,
    employees,
    subtotal
}) => {

    try {

        const response = await api.post(
            "/company/redeem/coupon",
            {
                couponCode,
                planName,
                employees,
                subtotal
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "REDEEM COUPON ERROR",
            error
        );

        if (error.response) {

            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (error.response.status === 401 || error.response.status === 403) {
                return {
                    status: "expire",
                    httpStatus: 401,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const createSubscriptionInvoice = async (subscriptionData) => {
    try {

        const response = await api.post(
            "/company/new/subscription",
            subscriptionData
        );

        console.log(
            "CREATE SUBSCRIPTION INVOICE RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "CREATE SUBSCRIPTION INVOICE ERROR",
            error
        );

        if (error.response) {

            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message:
                        error.response.data?.message ||
                        "Internal Server Error"
                };
            }

            if (error.response.status === 401 || error.response.status === 403) {
                return {
                    status: "expire",
                    httpStatus: 401,
                    message:
                        error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {

            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const confirmSubscription = async (data) => {
    try {

        const response = await api.post(
            "/company/confirm/subscription", data
        );

        return response.data;

    } catch (error) {

        console.error(
            "CONFIRM SUBSCRIPTION ERROR",
            error
        );

        if (error.response) {

            if (error.response) {

                if (error.response.status === 500) {
                    return {
                        status: "error",
                        httpStatus: 500,
                        message:
                            error.response.data?.message ||
                            "Internal Server Error"
                    };
                }

                if (error.response.status === 401 || error.response.status === 403) {
                    return {
                        status: "expire",
                        httpStatus: 401,
                        message:
                            error.response.data?.message ||
                            "Session expired. Please login again.",
                        pageName: "login"
                    };
                }

                return error.response.data;
            }

        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};


export const getInvoiceList = async () => {
    try {
        const response = await api.post(
            "/company/invoice/list"
        );
        return response.data;
    } catch (error) {
        console.error(
            "GET INVOICE LIST ERROR",
            error
        );

        if (error.response) {
            if (error.response) {

                if (error.response.status === 500) {
                    return {
                        status: "error",
                        httpStatus: 500,
                        message:
                            error.response.data?.message ||
                            "Internal Server Error"
                    };
                }

                if (error.response.status === 401 || error.response.status === 403) {
                    return {
                        status: "expire",
                        httpStatus: 401,
                        message:
                            error.response.data?.message ||
                            "Session expired. Please login again.",
                        pageName: "login"
                    };
                }

                return error.response.data;
            }
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};

export const downloadInvoice = async (invoiceId) => {
    try {

        const response = await api.post(
            `/company/invoice/${invoiceId}`
        );

        return response.data;

    } catch (error) {
        console.error(
            "DOWNLOAD INVOICE ERROR",
            error
        );

        if (error.response) {

            if (error.response) {

                if (error.response.status === 500) {
                    return {
                        status: "error",
                        httpStatus: 500,
                        message:
                            error.response.data?.message ||
                            "Internal Server Error"
                    };
                }

                if (error.response.status === 401 || error.response.status === 403) {
                    return {
                        status: "expire",
                        httpStatus: 401,
                        message:
                            error.response.data?.message ||
                            "Session expired. Please login again.",
                        pageName: "login"
                    };
                }

                return error.response.data;
            }
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server."
            };
        }

        return {
            status: "failure",
            message:
                error.message ||
                "Something went wrong."
        };
    }
};