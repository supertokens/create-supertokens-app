import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

function MyComponent(props: any) {
  if (canHandleRoute()) {
    return getRoutingComponent();
  }
  return "Route not found";
}

export default MyComponent;
