// We display this component as part of the SuperTokens login form to
// allow users to go back and select another tenant without logging in
export const ChangeTenantsButton = (props: {
    setHasSelectedTenantId: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <div
            data-supertokens="link tenants-link"
            onClick={() => {
                localStorage.removeItem("tenantId");
                props.setHasSelectedTenantId(false);
            }}
        >
            Log in to a different organisation
        </div>
    );
};
