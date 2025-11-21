import {Platform} from "react-native";

export default function WebOnly({children, style, className}) {
    if (Platform.OS !== "web") return null;

    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
}