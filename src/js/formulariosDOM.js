const loginDOM = `<h3>Iniciar Sesion</h3>
<label for="userLogin">Nombre de usuario:</label>
<input type="text" name="user" id="userLogin" class="inputText" />
<label for="passwordLogin">contraseña:</label>
<input type="password" name="password" id="passwordLogin" class="inputText"/>
<input class="subir" type="submit" value="Iniciar sesion" />
<span id="line"></span>`;
const signUpDOM = `<h3>Registrarse</h3>
<label for="userSignUp">Nombre de usuario:</label>
<input type="text" name="user" id="userSignUp" class="inputText" />
<label for="passwordSignUp">Crear contraseña</label>
<input type="password" name="password" id="passwordSignUp" class="inputText" />
<label for="confirmPasswordSignUp">Confirmar contraseña:</label>
<input
  type="password"
  name="confirmPassword"
  id="confirmPasswordSignUp"
  class="inputText"
/>
<input class="subir" type="submit" value="Registrarse" />`;
const formDOM = [loginDOM, signUpDOM];

export default formDOM;
