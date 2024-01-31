import { DM_DOMAIN } from "@env";
import axios from "axios";
import { setSendAndAcceptedContactList } from "../redux/action";

// add chatuser to contact list
const addToContactList = (senderId: string, receiverId: string) => {
    return new Promise(async(resolve, reject) => {
        const data = {
            "localuser": senderId,
            "localhost": DM_DOMAIN,
            "user": receiverId,
            "host": DM_DOMAIN,
            "nick": receiverId,
            "group": "Friends",
            "subs": "both"
        }
        await axios.post(`http://${DM_DOMAIN}:5280/api/add_rosteritem`, data, {
            headers: {
                "Content-Type": "application/json"
            },
            })
            .then(() => {
                setSendAndAcceptedContactList({
                    jid: `${receiverId}@${DM_DOMAIN}`,
                    nick: receiverId,
                    subscription: "both",
                    ask: "undefined",
                    group: "friends"
                });
                resolve("serverapi contactlist added successfully");
            })
            .catch((err) => {
                console.log("addrosteritem err", err);
                reject(err);
            })
    })
}

export {addToContactList}