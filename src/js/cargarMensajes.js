import urlServerEpico from "./url.js";
const serverUrl = urlServerEpico;
let listaUsuarios;
async function getUser() {
  try {
    const response = await fetch(`${serverUrl}/auth/user`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }
    const userData = await response.json();
    listaUsuarios = userData;
    return userData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
getUser();

const loadMsg = async (emisor) => {
  const $messages = document.querySelector("#message");
  const receptor = sessionStorage.getItem("id");
  if (emisor != -1) {
    try {
      const response = await fetch(
        `${serverUrl}/mensajesCargar?recep=${receptor}&emis=${emisor}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }
      const mensajesLista = await response.json();

      $messages.innerHTML = "";

      for (let i = 0; i < mensajesLista.length; i++) {
        const contenido = document.createElement("span");
        contenido.textContent = mensajesLista[i].contenido;
        const item = `<span class="${
          mensajesLista[i].id_emisor == receptor ? "emisor" : "receptor"
        }">${contenido.innerHTML}</span>`;
        $messages.insertAdjacentHTML("beforeend", item);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  } else {
    try {
      const response = await fetch(`${serverUrl}/chatGlobal`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }
      const mensajesLista = await response.json();
      $messages.innerHTML = "";
      for (let i = 0; i < mensajesLista.length; i++) {
        const contenido = document.createElement("span");
        contenido.textContent = mensajesLista[i].contenido;
        const item = `<span class="${
          mensajesLista[i].id_emisor == receptor ? "emisor" : "receptor"
        }">${contenido.innerHTML}<small>${
          mensajesLista[i].id_emisor == receptor ? "" : mensajesLista[i].emisor
        }</small></span>`;
        $messages.insertAdjacentHTML("beforeend", item);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
export default loadMsg;
