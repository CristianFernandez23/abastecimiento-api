import passport from "passport";
import local from 'passport-local';
import jwt from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import usersModels from "../models/users.models.js";
import { findUserByEmail } from "../services/users.services.js";
import { registerUser } from "../controllers/auth.controller.js";
import { cookieExtractor } from "../services/auth.services.js";


export const initPassport = () => {
    passport.use('register', new local.Strategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                const user = await findUserByEmail(req.body.email)
                if (user) {
                    return done(null, false, 'El usuario ya existe');
                };
                const newUser = await registerUser(req.body)
                return done(null, {message: 'Usuario registrado correctamente'});
            } catch (error) {
                done('Error al registrar el usuario', error);
            };
        }
    ))

    passport.use('jwt', new jwt.Strategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.COOKIE_SECRET
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (err) {
                return done(null, err);
            }
        }
    ));




    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        let user = usersModels.findById(id);
        done(null, user);
    });
};

