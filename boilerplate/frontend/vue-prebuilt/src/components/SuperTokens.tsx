import SuperTokens from "supertokens-auth-react";
import { SuperTokensReactConfig } from "@/config";

SuperTokens.init(SuperTokensReactConfig);

function MyComponent(props: any) {
  if (SuperTokens.canHandleRoute()) {
    return SuperTokens.getRoutingComponent();
  }
  return "Route not found";
}

export default MyComponent;
