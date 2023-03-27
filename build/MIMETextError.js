export class MIMETextError extends Error {
    name = '';
    description = '';
    constructor(message, description = '') {
        super(description);
        this.name = message;
        this.description = description;
    }
}
