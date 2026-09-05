import passport from "passport"; // Importa Passport para poder registrar nuestras estrategias.
import { Strategy as LocalStrategy } from "passport-local"; // Importa la estrategia local de Passport para trabajar con email y contraseña.
import usersRepository from "../repositories/users.repository.js"; // Permite buscar y crear usuarios en la base de datos.
import { createHash, isValidPassword } from "../utils/hash.js"; // Permite convertir la contraseña en un hash seguro.
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export const configurePassport = () => { // Define una función que centralizará la configuración de Passport.
  // Aquí registraremos las estrategias register, login y current.
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email", // Indica que Passport utilizará el campo email como identificador.
        passReqToCallback: true, // Permite recibir el objeto req junto con email y password.
      },
      async (req, email, password, done) => {
        const { first_name, last_name } = req.body; // Extrae del body los datos personales necesarios para crear el usuario.

        if (!first_name || !last_name || !email || !password) { // Verifica que todos los campos obligatorios estén presentes.
          return done(null, false, { message: "Faltan campos obligatorios" }); // Informa a Passport que el registro no puede continuar.
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Define una expresión regular básica para validar el formato del email.

        if (!emailRegex.test(email)) { // Comprueba si el email recibido cumple con el formato esperado.
          return done(null, false, { message: "Email inválido" }); // Detiene el registro e informa que el email no es válido.
        }

        if (password.length < 6) { // Comprueba que la contraseña tenga al menos 6 caracteres.
          return done(null, false, { message: "La contraseña debe tener al menos 6 caracteres" }); // Detiene el registro si la contraseña es demasiado corta.
        }

        const normalizedEmail = email.trim().toLowerCase(); // Elimina espacios al principio/final y convierte el email a minúsculas.
        const existingUser = await usersRepository.findByEmail(normalizedEmail); // Busca en la base de datos si ya existe un usuario con ese email.

        if (existingUser) { // Comprueba si la búsqueda encontró un usuario existente.
          return done(null, false, { message: "El email ya está registrado", statusCode: 409, }); // Detiene el registro para evitar emails duplicados.
        }

        const hashedPassword = await createHash(password); // Genera un hash seguro de la contraseña antes de guardarla.
        const newUser = await usersRepository.create({ // Crea el nuevo usuario utilizando el Repository.
          first_name: first_name.trim(), // Guarda el nombre eliminando espacios innecesarios.
          last_name: last_name.trim(), // Guarda el apellido eliminando espacios innecesarios.
          email: normalizedEmail, // Guarda el email ya normalizado.
          password: hashedPassword, // Guarda únicamente el hash de la contraseña.
          role: "user", // Asigna el rol user por defecto y evita que el cliente controle el rol.
        });

        return done(null, newUser); // Informa a Passport que el registro fue exitoso y devuelve el usuario creado.
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await usersRepository.findByEmail(normalizedEmail);

        if (!user) {
          return done(null, false, {
            message: "Credenciales inválidas",
          });
        }

        const passwordValid = await isValidPassword(
          password,
          user.password
        );

        if (!passwordValid) {
          return done(null, false, {
            message: "Credenciales inválidas",
          });
        }

        return done(null, user);
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([ 
          (req) => req.cookies?.currentUser,
        ]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        return done(null, payload);
      }
    )
  );
}

