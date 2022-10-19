
export const registerJWT = {
    secret: `${process.env.JWT_PRIVATE_KEY}`,
    signOptions: { expiresIn: '5h' }
}