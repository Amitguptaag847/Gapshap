export class User {
    id: string;
    name: string;
    phonenumber: number;
    contactId: string;
    lastMessage: string;
    time: Date;
    online: boolean;
    constructor(id: string, name: string, phonenumber: number, contactId: string, lastMessage: string, time: Date, online: boolean) {
        this.id = id;
        this.name = name;
        this.phonenumber = phonenumber;
        this.contactId = contactId;
        this.lastMessage = lastMessage;
        this.time = time;
        this.online = online;
    }
}
