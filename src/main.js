import { encrypt } from "../utis/crypto-api";
import "./css/login.css"
import getUserData from "./get-user-data";
import login from "./login"

let [password, _userData] = await login();
let [userName, serverUrl, userData] = await getUserData(_userData, password);

export function saveUserData(_userData) {
  localStorage.setItem("mw-s-ms-user-data", encrypt(password, JSON.stringify(_userData)));
  userData = _userData;
}

console.log({ password, userData, userName, serverUrl });

`
  <p>
    Group: <input name="group" type="text" placeholder="username...">
  </p>`