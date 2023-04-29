import {useSelector} from "react-redux";
import get from "lodash/get";

const UseAccess = (props) => {
    const profile = useSelector(state => state.auth.data);
    const access = props.roles;

    return access.includes(get(profile, 'role'));
};

export default UseAccess;