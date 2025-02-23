import "./css/login.css"
import getUserData from "./get-user-data";
import login from "./login"

let [password, _userData] = await login();
let [userName, serverUrl, userData] = await getUserData(_userData);

console.log({ password, userData, userName, serverUrl });

`
  <p>
    Group: <input name="group" type="text" placeholder="username...">
  </p>`