import urlServerEpico from "./url.js";
const serverUrl = urlServerEpico;

getUser().then((resultado) => {
  document.getElementById("loader").style.display = "none";
  jugadores = resultado;
  if (x != undefined && x != null) {
    const llave = resultado.find((lol) => lol.nombre == x);
    localStorage.setItem("FK", parseFloat(llave.Id));
    localStorage.setItem("usuario", x);
    document.getElementById("backgroundModal").classList.remove("active");
    document.getElementById("saludarUser").innerText = `Hola ${x}!`;
  }
});
