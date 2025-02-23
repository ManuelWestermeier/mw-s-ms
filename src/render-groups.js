const groupsHTML = `<button>C/J</button>
<div class="chats"></div>`;

export default function renderGroups(invite, selectChat, chats, seletedChat) {
    const chatSelectElem = document.querySelector(".chat .top");
    chatSelectElem.innerHTML = groupsHTML;

    const [joinButton, chatsElem] = chatSelectElem.children;

    for (const chat in chats) {
        const chatButton = document.createElement("button");
        chatButton.innerText = chat;

        if (chat == seletedChat) {
            chatButton.classList.add("active");
        }

        chatButton.onclick = () => selectChat(chat);


        chatsElem.appendChild(chatButton);
    }

    joinButton.addEventListener("click", invite);
}