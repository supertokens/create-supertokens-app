import SuperTokens from "supertokens-auth-react";

function MyComponent(props: any) {
  if (SuperTokens.canHandleRoute()) {
    return SuperTokens.getRoutingComponent();
  }
  return "Route not found";
}

export default MyComponent;
