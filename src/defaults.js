export const defaultServerURL = document.location.protocol == "https:" ? "wss://xy.com" : "ws://localhost:8080";

export const defaultUserName = "anonys";

export const defaultUserData = {
    servers: [defaultServerURL, "delete"],
    userNames: [defaultUserName, "delete"],
    groupsJoined: {},
};