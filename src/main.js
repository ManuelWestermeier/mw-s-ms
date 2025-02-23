import { decrypt, encrypt } from "../utis/crypto-api";
import getUserData from "./get-user-data";
import login from "./login"
import chat from "./chat";
import "./css/login.css"

let [password, _userData] = await login();
export let [userName, serverUrl, userData, client] = await getUserData(_userData, password);

function _saveUserData(_userData) {
  localStorage.setItem("mw-s-ms-user-data", encrypt(password, JSON.stringify(_userData)));
  userData = _userData;
}

function _getUserData() {
  return JSON.parse(decrypt(password, localStorage.getItem("mw-s-ms-user-data")));
}

chat(client, _saveUserData, _getUserData);