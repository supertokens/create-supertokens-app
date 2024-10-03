import React, { useEffect, useState } from "react";
import { getApiDomain } from "./config";

type Props = {
    setTenantId: React.Dispatch<React.SetStateAction<string | null>>;
    setShowTenantSelector: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TenantSelector = ({ setTenantId, setShowTenantSelector }: Props) => {
    type Tenant = {
        tenantId: string;
    };

    const [tenants, setTenants] = useState<Tenant[] | undefined>(undefined);
    const [selectedTenantId, setSelectedTenantId] = useState<string>("");

    const fetchTenants = async () => {
        const response = await fetch(`${getApiDomain()}/tenants`);

        if (response.status !== 200) {
            window.alert("Error fetching tenants");
            return;
        }

        const json = await response.json();
        setSelectedTenantId(json.tenants[0].tenantId);
        setTenants(json.tenants);
    };

    useEffect(() => {
        void fetchTenants();
    }, []);

    return (
        <div className="tenants-container">
            <div className="tenants-label">Select a tenant</div>
            {tenants === undefined ? (
                <div className="loader"></div>
            ) : (
                <select
                    value={selectedTenantId}
                    onChange={(event) => {
                        setSelectedTenantId(event.target.value);
                    }}
                    className="tenant-selector"
                >
                    {tenants?.map((tenant) => {
                        return (
                            <option key={tenant.tenantId} value={tenant.tenantId}>
                                {tenant.tenantId}
                            </option>
                        );
                    })}
                </select>
            )}

            {tenants !== undefined && (
                <button
                    className="tenants-button"
                    onClick={() => {
                        if (selectedTenantId !== "") {
                            localStorage.setItem("tenantId", selectedTenantId);
                            setShowTenantSelector(false);
                            setTenantId(selectedTenantId);
                        }
                    }}
                >
                    Continue
                </button>
            )}

            {tenants !== undefined && (
                <div
                    style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "#007aff",
                        cursor: "pointer",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                    onClick={() => {
                        setShowTenantSelector(false);
                    }}
                >
                    Cancel
                </div>
            )}
        </div>
    );
};
