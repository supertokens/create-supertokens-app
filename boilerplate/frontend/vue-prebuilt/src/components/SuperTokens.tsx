import { PreBuiltUIList } from "@/configUI";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

function MyComponent(props: any) {
  if (canHandleRoute(PreBuiltUIList)) {
    return getRoutingComponent(PreBuiltUIList);
  }
  return "Route not found";
}

export default MyComponent;
