/**
 * This is the controller of Profile-WebPage
 */
export class WebPageController {
    public data: any;
    constructor() {
        this.initialize()
    }

    /**
     * This mehtod is used to initialize the controller
     */
    public async initialize() {

    }

    /**
     * This is a function that checks whether the given credentials have a match in the database
     * @param {string} username the username of the user to be checked
     * @param {string} password the password of the user to be checked
     * @returns {Promise<boolean>} true if the user is valid, false if the user is not valid
     */
    public static verifyUser = async (username: string, password: string): Promise<boolean> => {
        // request backend for validation
        let response = await fetch('./api/users/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        let data = await response.json();
        return data.wasSuccessfull;
    }
}

export default new WebPageController();