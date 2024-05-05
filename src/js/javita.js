import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:4000/");
const serverUrl = "http://localhost:4000";
const $input = document.querySelector("#input");
const $messages = document.getElementById("message");
const $form = document.querySelector("#form");
const $formSignUp = document.querySelector("#formSignUp");
const $formLogin = document.querySelector("#formLogin");
let $formError = document.querySelector("#formError");
let listaUsuarios = "";
import formDOM from "./formulariosDOM.js";
import perfiles from "./cargarChats.js";
import loadMsg from "./cargarMensajes.js";
const $nombre = document.querySelector("#nombre");
const $mensajeria = document.querySelector("#mensajeria");
import chatActive from "./arrowLeft.js";
const $arrowLeft = document.querySelector("#arrowLeft");

$arrowLeft.addEventListener("click", () => {
  chatActive(1);
});
async function getUser(x) {
  try {
    const response = await fetch(`${serverUrl}/auth/user`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }
    const userData = await response.json();
    if (x) {
      document.getElementById("loaderForm").remove();
    }
    $formLogin.innerHTML = formDOM[0];
    $formSignUp.innerHTML = formDOM[1];
    listaUsuarios = userData;
    return userData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
getUser(true);
function buscarIdPorNombre(x, id) {
  if (id != undefined) {
    sessionStorage.setItem("id", id);
    return id;
  }
  for (let i = 0; i < listaUsuarios.length; i++) {
    if (listaUsuarios[i].nombre == x) {
      sessionStorage.setItem("id", listaUsuarios[i].id);
      return listaUsuarios[i].id;
    }
  }
}

sessionStorage.setItem("user", "");
sessionStorage.setItem("id", -1);
sessionStorage.setItem("id_emisor", -1);

socket.on("chat message", (msg, name, rec, emi) => {
  const idUrl = sessionStorage.getItem("id_emisor");
  if (
    !(idUrl == -1 || isNaN(idUrl) || idUrl == null) &&
    ((rec == sessionStorage.getItem("id") && emi == idUrl) ||
      (emi == sessionStorage.getItem("id") && rec == idUrl))
  ) {
    const item = `<span class="${
      sessionStorage.getItem("user") == name ? "emisor" : "receptor"
    }">${msg}<small>${
      sessionStorage.getItem("user") == name ? "" : name
    }</small></span>`;
    $messages.insertAdjacentHTML("beforeend", item);
  }

  if ((idUrl == -1 || isNaN(idUrl) || idUrl == null) && rec == -1) {
    const item = `<span class="${
      sessionStorage.getItem("user") == name ? "emisor" : "receptor"
    }">${msg}<small>${
      sessionStorage.getItem("user") == name ? "" : name
    }</small></span>`;
    $messages.insertAdjacentHTML("beforeend", item);
  }
});
socket.on("registro", (msg) => {
  getUser(false);
});

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id_receptor = sessionStorage.getItem("id_emisor");
  const id_emisor = sessionStorage.getItem("id");
  if ($input.value.trim() != "") {
    if (
      id_receptor == null ||
      id_receptor == "" ||
      isNaN(id_receptor) ||
      listaUsuarios[listaUsuarios.length - 1].id < id_receptor
    ) {
      socket.emit(
        "chat message",
        $input.value,
        sessionStorage.getItem("user"),
        -1,
        id_emisor
      );
    } else {
      socket.emit(
        "chat message",
        $input.value,
        sessionStorage.getItem("user"),
        id_receptor,
        id_emisor
      );
    }
    $input.value = "";
  }
});

$formSignUp.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formInfo = Object.fromEntries(formData.entries()); // user ,password ,confirmPassword

  if (
    formInfo.user.trim() != "" &&
    formInfo.password.trim() != "" &&
    formInfo.confirmPassword.trim() != ""
  ) {
    if ((formInfo.password.trim() == formInfo.confirmPassword.trim()) != "") {
      if (!listaUsuarios.find((persona) => persona.nombre == formInfo.user)) {
        registrarse(formInfo);
        document.getElementById("loginAndSignUp").remove();
        $mensajeria.classList.add("active");
        $nombre.innerHTML = formInfo.user;
        perfiles();
        loadMsg(-1);
        sessionStorage.setItem("user", formInfo.user);
        sessionStorage.setItem(
          "id",
          listaUsuarios[listaUsuarios.length - 1].id + 1
        );
      } else {
        alertErrores("El usuario ya existe");
      }
    } else {
      alertErrores("Las contraseñas no coinciden");
    }
  } else {
    alertErrores("Rellene todos los campos");
  }
});

$formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formInfo = Object.fromEntries(formData.entries()); // user, password
  if (formInfo.user != "" && formInfo.password.trim() != "") {
    if (listaUsuarios.find((persona) => persona.nombre == formInfo.user)) {
      if (
        listaUsuarios.find((persona) => persona.nombre == formInfo.user) &&
        listaUsuarios.find(
          (persona) => persona.contrasenna == formInfo.password
        )
      ) {
        document.getElementById("loginAndSignUp").remove();
        $mensajeria.classList.add("active");
        $nombre.innerHTML = formInfo.user;
        perfiles();
        sessionStorage.setItem("user", formInfo.user);
        buscarIdPorNombre(formInfo.user);
        loadMsg(-1);
      } else {
        alertErrores("Contraseña incorrecta");
      }
    } else {
      alertErrores("EL usuario no existe");
    }
  } else {
    alertErrores("Rellene todos los campos");
  }
});

const registrarse = async (datos) => {
  const res = await fetch(`${serverUrl}/register/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: datos.user,
      password: datos.password,
    }),
  });
};

const alertErrores = (err) => {
  $formError.classList.remove("active");
  $formError.textContent = err;
  void $formError.offsetWidth; // Truco para reiniciar la animación
  $formError.classList.add("active");
};
