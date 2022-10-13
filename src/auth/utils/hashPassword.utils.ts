import { genSalt, hash, compare } from "bcrypt";

export const passwordHashing = {
    /**
       * Generate hash of user password at time of registration   
       *
       * @param password User password to be hashed
       * @returns Hashed password
       */
    generateHash: async (password: string): Promise<string> => {
        try {
            const salt: string = await genSalt(10)
            return hash(password, salt);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Compare user enter password with already existing hashed password   
     *
     * @param userPassword Password entered by user
     * @param dbHashPassword Password existing in database
     * @returns Boolean value showing whether both passwords match or not
     */
    comparePassword: async (userPassword: string, dbHashPassword): Promise<boolean> => {
        const isPasswordCorrect: boolean = await compare(userPassword, dbHashPassword);
        return isPasswordCorrect;
    }

}