import Client from "wsnet-client";
import { encrypt } from "../utis/crypto-api";
import { defaultServerURL, defaultUserData, defaultUserName } from "./defaults";

const getUserDataHTML = `<form id="connect">
  <p>
    Server: <input list="servers" name="server" type="text" placeholder="server url...">
  </p>
  <datalist id="servers"></datalist>
  <p>
    Username: <input list="usernames" name="username" type="text" placeholder="username...">
  </p>
  <datalist id="usernames"></datalist>
  <p>
    >>input "delete" and next to delete the listdata<<
  </p>
  <p id="error"></p>
  <button type="submit">
    Next
</button>`;

export default function getUserData(userData, password) {
  document.body.innerHTML = getUserDataHTML;

  const [serverInput, userNameInput] = document.querySelectorAll("input");
  const [serverList, userNameList] = document.querySelectorAll("datalist");

  serverInput.value = userData.servers?.[0] ?? defaultServerURL;
  userNameInput.value = userData.userNames?.[0] ?? defaultUserName;

  function render() {
    serverList.innerHTML = "";
    userNameList.innerHTML = "";
    for (const serverUrl of userData.servers) {
      const option = document.createElement("option");
      option.value = serverUrl;
      serverList.appendChild(option);
    }

    for (const serverUrl of userData.userNames) {
      const option = document.createElement("option");
      option.value = serverUrl;
      userNameList.appendChild(option);
    }
  }
  render();

  const errorField = document.querySelector("#error");
  userNameInput.focus();

  return new Promise((res) => {
    document.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault();

      let exit = false;
      if (serverInput.value == "delete") {
        userData.servers = defaultUserData.servers;
        exit = true;
      }
      if (userNameInput.value == "delete") {
        userData.userNames = defaultUserData.userNames;
        exit = true;
      }
      if (exit) {
        localStorage.setItem("mw-s-ms-user-data", encrypt(password, JSON.stringify(userData)));
        render();
        return;
      }

      const userName = userNameInput.value, serverUrl = serverInput.value;

      if (userName == "") {
        return errorField.innerText = "error: input username";
      }

      if (serverUrl == "") {
        return errorField.innerText = "error: input servername";
      }

      try {
        const url = new URL(serverUrl);
        if (!url.protocol.includes("ws")) throw new Error("wrong url prtocol (only wss:/ws:)");
        if (document.location.protocol == "https:" && url.protocol != "wss:") {
          throw new Error("on https sites only wss protocol");
        }
      } catch (error) {
        return errorField.innerText = "error: " + error;
      }

      if (!userData.userNames.includes(userName)) {
        userData.userNames.unshift(userName);
      }
      if (!userData.servers.includes(serverUrl)) {
        userData.servers.unshift(serverUrl);
      }

      const client = new Client(serverUrl);
      client.onclose = () => alert("connection los...reload the page") || location.reload();

      const isAuth = await client.get("auth");

      if (!isAuth) {
        return errorField.innerText = "error: username is unavadible now";
      }

      res([userName, serverUrl, userData, client]);
    });
  });
}