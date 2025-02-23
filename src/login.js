import { decrypt, encrypt } from "../utis/crypto-api";
import { defaultUserData } from "./defaults";
import "./css/login.css";
import isJSON from "./utils/is-json";

const loginPageHTML = `<form id="login">
    <h1>
        Login Local
    </h1>
    <p>
      Password: <input name="password" type="password" placeholder="password...">
    </p>
    <p id="error"></p>
    <button type="submit">
      Login
    </button>
</form>`;

const registerPageHTML = `<form id="login">
    <h1>
        Register Local
    </h1>
    <p>
      Password: <input name="password" type="password" placeholder="password...">
    </p>
    <p id="error"></p>
    <button type="submit">
      Login
    </button>
</form>`;

export default function login() {
    const userData = localStorage.getItem("mw-s-ms-user-data");

    document.body.innerHTML = userData ? loginPageHTML : registerPageHTML;

    const passwordInput = document.querySelector("input");
    const errorField = document.querySelector("#error");
    passwordInput.focus();

    return new Promise((res) => {
        document.querySelector("form").addEventListener("submit", e => {
            e.preventDefault();

            const password = passwordInput.value ?? "";
            const isInvalidPassword = password.length < 8;

            if (isInvalidPassword) {
                errorField.innerText = "error: no secure password (min length: 8)";
            }
            else if (!userData) {
                res([password, defaultUserData]);
                localStorage.setItem("mw-s-ms-user-data", encrypt(password, JSON.stringify(defaultUserData)));
            }
            else {
                try {
                    const decData = decrypt(password, userData);
                    const isJson = isJSON(decData);
                    if (isJson[0]) {
                        res([password, isJson[1]]);
                    }
                    else {
                        errorField.innerText = "!error: wrong passwrod!\n!cannot decrypt userdata!\n>>please retry";
                    }
                } catch (error) {
                    errorField.innerText = "error: wrong password";
                }
            }
        });
    });
}