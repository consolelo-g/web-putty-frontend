// ===== Connection Status =====
export type Status =
    | "idle"
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

// ===== Connection (full payload for backend) =====
export interface Connection {
    host: string;
    port: number;
    username: string;
    password: string;
}

// ===== Safe connection (UI display only) =====
export interface ConnectionInfo {
    host: string;
    username: string;
}

// ===== WebSocket Ref =====
export type SocketRef = React.MutableRefObject<WebSocket | null>;

// ===== Generic Helpers =====
export type SetStatus = (status: Status) => void;
export type SetActiveVM = (vm: string) => void;