import renderGroups from "./render-groups";
import "./css/chat.css";
import { basicHash, randomBytes } from "../utis/crypto-api";

const chatPageHTML = `<div class="chat">
    <div class="top">
    </div>
    <div class="bottom">
    </div>
</div>`;

export default async function chat(client, saveUserData, getUserData) {
    document.body.innerHTML = chatPageHTML;

    let userData = getUserData();
    const chats = userData.groupsJoined;
    const chatKeys = Object.keys(chats);
    let selectedChat = chatKeys?.[0] || null;

    for (const chat in chats) {
        const _chat = userData.groupsJoined[chat];
        const messages = await client.get("join", {
            keyHash: _chat.keyHash,
            id: chat,
        });
        if (!messages) {
            continue;
        }
        userData.groupsJoined[chat].messages = messages;
    }
    saveUserData(userData);

    function update() {
        renderGroups(async () => {
            if (!confirm("create or join group")) return;
            const id = prompt("chat id to join", randomBytes(5));
            const key = basicHash(prompt("password to group", randomBytes(200)));
            const keyHash = basicHash(key).slice(0, 20);
            const messages = await client.get("join", { id, keyHash });

            const chatData = {
                messages,
                key,
                keyHash,
            };

            selectedChat = id;

            if (!chatData.messages)
                return alert("an error has happend");

            userData.groupsJoined[id] = chatData;

            saveUserData(userData);

            update();
        }, (chat) => {
            selectedChat = chat;
            update();
        },
            userData.groupsJoined,
            selectedChat
        );
        // renderMessages();

        saveUserData(userData);
    }

    update();
}