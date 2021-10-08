import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import * as passportLocal from 'passport-local';
import { config } from '../config/config';

export class Passport {

    public passport = passport;

    constructor() {
        // Local Strategy (login)
        passport.use(new passportLocal.Strategy({
            usernameField: 'email',
            passwordField: 'password'
        }, (email: string, password: string, callback: Function) => {

            try {
                // Perform a DB query here to check if user with these credentials (username & password) exist.

                const user = {
                    id: 1,
                    name: 'John Doe',
                    email: 'johndoe@gmail.com'
                };

                // const user = null;

                // User not exist
                if (!user)
                    return callback(null, null, { message: 'Incorrect email or password.' });


                // User exist
                return callback(null, user, {
                    message: 'Logged In Successfully'
                });

            } catch (error) {
                return callback(error);
            }
        }));


        // JsonWebToken Strategy
        passport.use(new passportJWT.Strategy({
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.server.jwt.secret
        }, (jwtPayload: any, callback: Function) => {
            try {

                // Here: DB Query to check if user exists and he is activated (not banned)

                return callback(null, jwtPayload);

            } catch (error) {
                return callback(error);
            }
        }
        ));

    }
}
