import api from "./api";

export const registerEmployee = async (data) => {
    try {
        const formData = new FormData();
        const employee =  data.employee;

         // Convert nested bankDetails into flat DTO properties
        const employeePayload = {
            ...employee,

            bankName: employee.bankDetails?.bankName || "",
            accountNumber: employee.bankDetails?.accountNumber || "",
            ifscCode: employee.bankDetails?.ifscCode || "",
            branch: employee.bankDetails?.branch || "",
            accountHolderName: employee.bankDetails?.accountHolderName || ""
        };

        // Remove nested object because DTO uses flat fields
        delete employeePayload.bankDetails;

        const employeeJson = JSON.stringify(employeePayload);

        const employeeBlob = new Blob(
            [employeeJson],
            { type: "application/json" }
        );

        console.log("Employee JSON size:", employeeBlob.size);
        console.log("Employee JSON size (KB):",
            (employeeBlob.size / 1024).toFixed(2)
        );
        console.log("Employee photo:", data.employeePhoto);
        console.log("Photo size:", data.employeePhoto?.size || 0);

        formData.append("employee", employeeBlob);

        if (data.employeePhoto) {
            formData.append("employeePhoto", data.employeePhoto);
        }

        const res = await api.post(
            "/company/attendance/add/employee",
            formData
        );

        return res.data;

    } catch (error) {
        console.error(error);

        if (error.response) {
            if (error.response.status === 500) {
                return {
                    status: "error",
                    httpStatus: 500,
                    message: error.response.data?.message || "Internal Server Error"
                };
            }

            if ([401, 403].includes(error.response.status)) {
                return {
                    status: "expire",
                    httpStatus: error.response.status,
                    message: error.response.data?.message ||
                        "Session expired. Please login again.",
                    pageName: "login"
                };
            }

            return error.response.data;
        }

        if (error.request) {
            return {
                status: "failure",
                message: "No response from server. Please try again."
            };
        }

        return {
            status: "failure",
            message: error.message || "Something went wrong."
        };
    }
};


export const getEmployeeList = async (companyName) => {
    try {
        const res = await api.get(
            `/company/employee/list/${companyName}`
        );

        return res.data;
    } catch (error) {
        console.error("GET EMPLOYEE LIST ERROR:", error);

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
                message: "No response from server. Please try again."
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

export const getEmployeeDetails = async (employeeId) => {
    try {

        const res = await api.get(
            `/company/employee/${employeeId}`
        );
        return res.data;

    } catch (error) {
        console.error("GET EMPLOYEE DETAILS ERROR", error);
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
                message: "No response from server. Please try again."
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

export const updateEmployee = async (payload) => {
    try {
        const response = await api.post(
            `/company/update/employee`,
            payload
        );

        return response.data;

    } catch (error) {
        console.error("UPDATE EMPLOYEE ERROR", error);

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
                message: "No response from server. Please try again."
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

export const updateEmployeeStatus = async (employeeId) => {
    try {
        const response = await api.post(
            `/company/update/employee/status/${employeeId}`
        );

        return response.data;
    } catch (error) {
        console.error("UPDATE STATUS ERROR", error);

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
                message: "No response from server. Please try again."
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

export const deleteEmployee = async (employeeId) => {
    try {
        const response = await api.post(
            `/company/delete/employee/${employeeId}`
        );

        return response.data;
    } catch (error) {
        console.error(error);

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
                message: "No response from server. Please try again."
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

export const getAttendanceLogs = async (employeeId, month) => {
    try {
        const response = await api.get(
            `/company/attendance/logs/${employeeId}?month=${month}`
        );

        return response.data;
    } catch (error) {
        console.error(error);

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
                message: "No response from server. Please try again."
            };
        }

        return {
            status: "failure",
            message: "No response from server."
        };
    }
};

// Get Company Settings
export const getCompanySettings = async () => {
    try {
        const res = await api.get("/company/profile/settings");
        console.log("Get Company Settings API response:", res);
        return res.data;
    } catch (error) {
        console.error("Get Company Settings Error:", err);
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
                message: "No response from server. Please try again."
            };
        }

        return {
            status: "failure",
            message: error.message || "Something went wrong."
        };
    }
};

// Update Company Settings
export const updateCompanySettings = async (company) => {
    try {
        const res = await api.post("/company/profile/settings", company);
        console.log("Update Company Settings API response:", res);

        return res.data;
    } catch (error) {
        console.error("Update Company Settings Error:", err);

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
                message: "No response from server. Please try again."
            };
        }

        return {
            status: "failure",
            message: error.message || "Something went wrong."
        };
    }
};

// Get Employee Settings
export const getEmployeeSettings = async () => {
    try {
        const res = await api.get("/company/employee/settings");
        console.log("Get Employee Settings API response:", res);
        return res.data;
    } catch (error) {
        console.error("Get Employee Settings Error:", err);

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
                message: "No response from server. Please try again."
            };
        }

        return {
            status: "failure",
            message: error.message || "Something went wrong."
        };
    }
};

// Update Employee Settings
export const updateEmployeeSettings = async (settings) => {
    try {
        const res = await api.post(
            "/company/employee/settings",
            settings
        );
        console.log("Update Employee Settings Response:", res);
        return res.data;

    } catch (error) {
        console.error("Update Employee Settings Error:", err);
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
            message: error.message || "Something went wrong."
        };
    }
};

// Update Attendance Settings
export const getAttendanceSettings = async (
    isLeavedata) => {

    try {
        const res = await api.get(
            `/company/attendance/settings/${isLeavedata}`
        );

        console.log("Attendance/Leave Settings Response:", res);

        return res.data;

    } catch (error) {

        console.error("Update Attendance Settings Error:", err);

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
            message: error.message || "Something went wrong."
        };
    }
};

// Update Attendance Settings
export const updateAttendanceSettings = async (
    settings,
    isLeaveUpdate
) => {
    try {
        const res = await api.post(
            `/company/attendance/settings/${isLeaveUpdate}`,
            settings
        );

        console.log("Update Attendance Settings Response:", res);

        return res.data;

    } catch (error) {

        console.error("Update Attendance Settings Error:", err);

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
            message: error.message || "Something went wrong."
        };
    }
};

// Save Holiday Calendar
export const saveHolidayCalendar = async (holidays) => {
    try {
        const res = await api.post(
            "/company/holiday/calendar",
            holidays
        );
        console.log(
            "Save Holiday Calendar Response:",
            res
        );
        return res.data;
    } catch (error) {
        console.error(
            "Save Holiday Calendar Error:",
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
                message:
                    "No response from server."
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

// list Holiday Calander
export const getHolidayCalanderList = async () => {

    try {
        const res = await api.get(
            `/company/list/holiday/calendar`
        );
        console.log("List Holiday Calander Response:", res);
        return res.data;
    } catch (error) {
        console.error("List  Holiday Calander Error:", err);
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

// Save Entry Points
export const saveEntryPoints = async (entryPoints) => {
    try {
        const res = await api.post(
            "/company/entrypoint",
            entryPoints
        );
        console.log(
            "Save Entry Points Response:",
            res
        );
        return res.data;
    } catch (error) {
        console.error(
            "Save Entry Points Error:",
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

// Get Entry Points
export const getEntryPoints = async () => {
    try {
        const res = await api.get(
            "/company/entrypoint/list"
        );
        console.log(
            "Get Entry Points Response:",
            res
        );

        return res.data;
    } catch (error) {
        console.error(
            "Get Entry Points Error:",
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
                message:
                    "No response from server."
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

export const deleteEntryPoint = async (entryPointId) => {
    try {
        const response = await api.post(
            `/company/deleteEntryPoint/${entryPointId}`
        );

        return response.data;

    } catch (error) {
        console.error("DELETE ENTRY POINT ERROR", error);

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