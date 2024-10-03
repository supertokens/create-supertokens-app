import React, { useEffect, useState } from "react";
import styles from "./TenantSelector.module.css";
export const TenantSelector = (props: {
    setTenantId: React.Dispatch<React.SetStateAction<string | null>>;
    setShowTenantSelector: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    type Tenant = {
        tenantId: string;
    };

    const [tenants, setTenants] = useState<Tenant[] | undefined>(undefined);
    const [selectedTenantId, setSelectedTenantId] = useState<string>("");

    const fetchTenants = async () => {
        const response = await fetch(`/api/tenants`);

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
        <div className={styles.tenantsContainer}>
            <div className={styles.tenantsLabel}>Select a tenant</div>
            {tenants === undefined ? (
                <div className={styles.loader}></div>
            ) : (
                <select
                    value={selectedTenantId}
                    onChange={(event) => {
                        setSelectedTenantId(event.target.value);
                    }}
                    className={styles.tenantSelector}
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
                    className={styles.tenantsButton}
                    onClick={() => {
                        if (selectedTenantId !== "") {
                            localStorage.setItem("tenantId", selectedTenantId);
                            props.setShowTenantSelector(false);
                            props.setTenantId(selectedTenantId);
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
                        props.setShowTenantSelector(false);
                    }}
                >
                    Cancel
                </div>
            )}
        </div>
    );
};
