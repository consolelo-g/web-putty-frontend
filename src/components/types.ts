// ===== Connection Status =====
export type Status =
    | "idle"
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

// ===== Connection =====
export interface Connection {
    host: string;
    port: number;
    username: string;
    password: string;
}

// ===== Tab =====
export interface Tab {
    id: string;                 // session id
    title: string;              // Tab 1 / Tab 2
    serverKey: string;          // unique server key
    connection: Connection;
    createdAt: number;
}

// ===== UI Safe =====
export interface ConnectionInfo {
    host: string;
    username: string;
}

// ===== WebSocket =====
export type SocketRef =
    React.MutableRefObject<WebSocket | null>;

// ===== Helpers =====
export type SetStatus = (
    status: Status
) => void;

export type SetActiveVM = (
    vm: string
) => void;

export type ViewState =
    | "empty"
    | "overview"
    | "terminal";

// ===== Utils =====
export const getServerKey = (
    c: Connection
) =>
    `${c.host}:${c.port}:${c.username}`;