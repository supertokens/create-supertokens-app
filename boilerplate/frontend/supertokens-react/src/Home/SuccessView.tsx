import CallAPIView from "./CallAPIView";
import { ReactComponent as ArrowRight } from "./arrow-right.svg";

export default function SuccessView(props: { userId: string }) {
    let userId = props.userId;
    return (
        <div className="main-container">
            <div className="top-band success-title bold-500">Login successful</div>
            <div className="inner-content">
                <div>Your userID is:</div>
                <div id="user-id">
                    aihdf2390-hfqefuabfjab-fjabdfljadsdssd...
                    {userId}
                </div>
                <CallAPIView />
            </div>
            <div className="bottom-band bottom-cta-container">
                <div className="view-code" role={"button"}>
                    View Code <ArrowRight id="arrow right" />
                </div>
            </div>
        </div>
    );
}
