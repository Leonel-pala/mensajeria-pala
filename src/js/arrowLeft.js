const $chat = document.querySelector("#chat");
const chatActive = (x) => {
  if (x == 1) {
    $chat.classList.remove("active");
  } else {
    $chat.classList.add("active");
  }
};
export default chatActive;
