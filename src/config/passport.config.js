import passport from "passport"; // Importa Passport para poder registrar nuestras estrategias.
import { Strategy as LocalStrategy } from "passport-local"; // Importa la estrategia local de Passport para trabajar con email y contraseña.
import usersService from "../services/users.service.js"; // Permite buscar y crear usuarios en la base de datos.
import { isValidPassword } from "../utils/hash.js"; 
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
        try {
          const user = await usersService.register({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            password,
          });

          return done(null, user);
        } catch (error) {
          return done(null, false, {
            message: error.message,
            statusCode: error.statusCode || 400,
          });
        }
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
        try {
          const user = await usersService.login(email, password);

          return done(null, user);
        } catch (error) {
          return done(null, false, {
            message: error.message,
            statusCode: error.statusCode || 401,
          });
        }
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

