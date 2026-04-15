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

export interface Tab {
    id: string;           // session_id from backend
    title: string;        // host or custom name
    connection: Connection;
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