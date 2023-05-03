import * as React from "react";
import { PreBuiltUIList } from "src/configUI";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

class SuperTokensReactComponent extends React.Component {
    override render() {
        if (canHandleRoute(PreBuiltUIList)) {
            return getRoutingComponent(PreBuiltUIList);
        }
        return "Route not found";
    }
}

export default SuperTokensReactComponent;
