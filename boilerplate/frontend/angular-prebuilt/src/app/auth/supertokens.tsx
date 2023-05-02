import * as React from "react";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

class SuperTokensReactComponent extends React.Component {
    override render() {
        if (canHandleRoute()) {
            return getRoutingComponent();
        }
        return "Route not found";
    }
}

export default SuperTokensReactComponent;
