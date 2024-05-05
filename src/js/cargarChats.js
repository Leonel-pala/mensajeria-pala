const serverUrl = "http://localhost:4000";
const $usuarios = document.querySelector("#usuarios");
import loadMsg from "./cargarMensajes.js";
import chatActive from "./arrowLeft.js";
const $arrowLeft = document.querySelector("#arrowLeft");

const perfile = async (x) => {
  try {
    const response = await fetch(`${serverUrl}/perfiles`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }
    const userData = await response.json();
    if (x) {
      document.getElementById("loaderForm").remove();
    }
    userData.forEach((element) => {
      if (element.nombre != sessionStorage.getItem("user")) {
        $usuarios.innerHTML += `<a data-id="${element.id}" class="chats" href="#?id=${element.id}">${element.nombre}</a>`;
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }

  const $chatsBtns = document.querySelectorAll(".chats");
  const $chatNombre = document.querySelector("#chatNombre");
  $chatsBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      $chatsBtns.forEach((btn) => {
        btn.classList.remove("active");
      });
      btn.classList.add("active");
      $chatNombre.innerHTML = btn.textContent;
      loadMsg(btn.dataset.id);
      btn.classList.add("active");
      chatActive(2);

      sessionStorage.setItem("id_emisor", parseInt(btn.dataset.id));
    });
  });
};
export default perfile;
