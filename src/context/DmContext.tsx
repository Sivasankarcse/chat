import { View, Text, AppState } from 'react-native'
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import isEmpty from 'lodash/isEmpty';
import { client, xml } from '@xmpp/client';
import { useSelector } from 'react-redux';
import debug from '@xmpp/debug';
import axios from 'axios';
import { saveChatInRedux, setContactList, setEndReachedStatus, setHistoryDataRequested } from '../redux/action';
import { DM_DOMAIN, DM_PASSWORD, DM_SERVICE } from '@env';
import * as chatServerApi from "../api/chatServerApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DmContext = createContext(null)

type XmppInstance = {
    xmpp: () => {} | boolean
}

const DmContextProvider = ({ children }) => {

    const [xmppInstance, setXmppInstance] = useState("");
    const appState = useRef(AppState.currentState)
    const jid = useSelector(state => state?.['chatData']?.jid) || ""
    const lastMsgId = useSelector(state => state?.['chatData']?.lastMsgId) || ""
    const isEndReached = useSelector(state => state?.['chatData']?.isEndReached)
    const isHistoryRequested = useSelector(state => state?.['chatData']?.isHistoryRequested)
    const contactList = useSelector(state => state?.['chatData']?.contactList) || [];
    var updatedData = [];

    const xmpp = useCallback(
        !isEmpty(jid) && client({
            username: jid,
            password: DM_PASSWORD,
            domain: DM_DOMAIN,
            service: DM_SERVICE
        }), [!isEmpty(jid)])

    !isEmpty(jid) && debug(xmpp, false)

    useEffect(() => {
        console.log("useeffect1", contactList)
        // start xmpp server if jid changed or this dmContext called
        if (!isEmpty(jid)) {
            xmpp.start();
            userOnlineListener();
            stanzaListener();
            // fetchMessages()
        }
        isEmpty(contactList) && !isEmpty(jid) && getContactList()

        // Change the xmpp server status when appstate change in the device
        const handleChange = AppState.addEventListener("change", changedState => {
            appState.current = changedState;
            if (appState.current === "background" || appState.current === "inactive") {
                !isEmpty(jid) && xmpp.stop();
            } else if (appState.current === "active") {
                !isEmpty(jid) && xmpp.start();
            }
        })

        setXmppInstance(xmpp)

        // clear the appstate status
        return () => {
            handleChange.remove()
        }
    }, [jid])

    // useEffect(() => {
    //     // Change the xmpp server status when appstate change in the device
    //     const handleChange = AppState.addEventListener("change", changedState => {
    //         appState.current = changedState;
    //         if (appState.current === "background" || appState.current === "inactive") {
    //             !isEmpty(jid) && xmpp.stop();
    //         } else if (appState.current === "active") {
    //             !isEmpty(jid) && xmpp.start();
    //         }
    //     })

    //     // clear the appstate status
    //     return () => {
    //         handleChange.remove()
    //     }
    // }, [])

    // get existing contactlist
    const getContactList = async () => {
        const params = {
            host: DM_DOMAIN,
            user: jid
        }
        const headers = {
            headers: {
                "Content-Type": "application/json"
            },
        }
        await axios.post(`http://${DM_DOMAIN}:5280/api/get_roster`, params, headers)
            .then(({ data }) => {
                console.log("getrostare", data);
                console.log("im jid", jid);
                setContactList(data);
            })
            .catch((err) => console.log("err", err.response.data.message))
    }

    const userOnlineListener = () => {
        xmpp.on("online", async () => {
            await xmpp
                .send(xml("presence", {}, xml("status", {}, "online")))
                .catch((err) => { console.log("presence err", err) })
        })
    }

    const fetchMessages = async () => {
        const fetchMsg = xml(
            "iq",
            {
                type: "set",
                id: Date.now().toString
            },
            xml(
                "query",
                {
                    xmlns: "urn:xmpp:mam:2",
                },
                xml(
                    "x",
                    {
                        xmlns: "urn:xmpp:mam:2",
                        type: "submit"
                    },
                    xml(
                        "field",
                        {
                            var: "FORM_TYPE",
                            type: "hidden",
                        },
                        xml("value", {}, "urn:xmpp:mam:2")
                    ),
                    xml(
                        "field",
                        {
                            var: "with"
                        },
                        xml("value", {}, `${jid}@${DM_DOMAIN}`)
                    )
                ),
                xml(
                    "set",
                    { xmlns: "http://jabber.org/protocol/rsm" },
                    xml("max", {}, 20),
                    xml("before")
                ),
                xml("flip-page")
            )
        )

        await xmpp.send(fetchMsg).catch((err: any) => { console.log("im fetchmsg catch err", err) });
    }

    const stanzaListener = () => {
        xmpp.on("stanza", async (stanza) => {
            console.log("im stanza", stanza);
            if (stanza.is("message")) {

                const isResult = stanza?.children?.[0]?.name === "result";

                const msgArr = stanza?.children?.filter((elem) => elem?.name === "body");

                const isArchiveMsg = stanza?.children?.[0]?.children?.[0]?.children?.[0].children?.filter(
                    (item) => item?.name === "body")?.[0]?.children?.[0];

                const isNewMsg = msgArr?.[0]?.children?.[0];

                const from = isResult ?
                    stanza?.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.from?.slice(0, stanza?.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.from?.lastIndexOf("@"))
                    : stanza?.attrs?.from?.slice(0, stanza?.attrs?.from?.lastIndexOf("@"));

                // if(contactList.indexOf(from)){
                //     console.log("im here", from);
                //     console.log(contactList.indexOf(from));
                //     // fetchLastMsg(from)
                //     chatServerApi.addToContactList(jid, from).then((res) => {console.log(res)}).catch((err) => console.log("err", err))
                // }

                const to = isResult ?
                    stanza?.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.to?.slice(0, stanza?.children?.[0]?.children?.[0]?.children?.[0]?.attrs?.to?.lastIndexOf("@"))
                    : stanza?.attrs?.to?.slice(0, stanza?.attrs?.to?.lastIndexOf("@"));

                const timestamp = isResult ?
                    stanza?.children?.[0]?.attrs?.id
                    : stanza?.children?.filter((item) => item?.name === "archived")?.[0]?.attrs?.id;

                const msg = isResult ? isArchiveMsg : isNewMsg;

                const type = isResult ?
                    stanza?.children?.[0]?.children?.[0]?.children?.[0].attrs?.type || "chat"
                    : stanza?.attrs?.type;

                console.log("im mesg", msg);
                if (msg) {
                    saveChatInRedux({
                        from: from === jid ? to : from,
                        conv: {
                            msg,
                            to,
                            timestamp,
                            type,
                        }
                    })
                }
            } else if (stanza.is("iq")) {
                const chatHistoryFinishStatus = stanza?.children?.[0]
                const chatHistoryError = stanza?.children?.[1]?.name || ""
                const attributeType = stanza?.attrs?.type
                const chatHistoryCompleted = chatHistoryFinishStatus?.attrs?.complete || ""

                if (attributeType === "result" && chatHistoryFinishStatus?.name === "fin") {
                    console.log("isendreached", isEndReached, chatHistoryCompleted, typeof (chatHistoryCompleted))

                    if (chatHistoryCompleted === "true" || chatHistoryError === "error") {
                        setEndReachedStatus(true)
                    }

                    // it will identify historyDataRequested finished successfully
                    setHistoryDataRequested(false)
                }
            }
        });
    }

    // const fetchLastMsg = (id: string) => xml(
    //         "iq",
    //         {
    //             type: "set",
    //             id: `${jid}`
    //         },
    //         xml(
    //             "query",
    //             {
    //                 xmlns: "urn:xmpp:mam:2"
    //             },
    //             xml(
    //                 "x",
    //                 {
    //                     xmlns: "jabber:x:data",
    //                     type: "submit"
    //                 },
    //                 xml(
    //                     "field",
    //                     {
    //                         var: "FORM_TYPE",
    //                         type: "hidden"
    //                     },
    //                     xml("value", {}, "urn:xmpp:mam:2")
    //                 ),
    //                 xml(
    //                     "field",
    //                     {
    //                         var: "with"
    //                     },
    //                     xml("value", {}, id)
    //                 )
    //             ),
    //             xml(
    //                 "set",
    //                 {
    //                     xmlns: "http://jabber.org/protocol/rsm" 
    //                 },
    //                 xml("max", {}, 1),
    //                 xml("before"),
    //             )
    //         )
    //     )
    //     <iq type='set' id='q29303'>
    //   <query xmlns='urn:xmpp:mam:2'>
    //       <x xmlns='jabber:x:data' type='submit'>
    //         <field var='FORM_TYPE' type='hidden'><value>urn:xmpp:mam:2</value></field>
    //         <field var='start'><value>2010-08-07T00:00:00Z</value></field>
    //       </x>
    //       <set xmlns='http://jabber.org/protocol/rsm'>
    //          <max>10</max>
    //          <before/>
    //       </set>
    //   </query>
    // </iq>

    const fetchLastMsg = (id: any) => xml(
        "iq",
        {
            type: "set",
            id: Date.now().toString
        },
        xml(
            "query",
            {
                xmlns: "urn:xmpp:mam:2",
            },
            xml(
                "x",
                {
                    xmlns: "urn:xmpp:mam:2",
                    type: "submit"
                },
                xml(
                    "field",
                    {
                        var: "FORM_TYPE",
                        type: "hidden",
                    },
                    xml("value", {}, "urn:xmpp:mam:2")
                ),
                xml(
                    "field",
                    {
                        var: "with"
                    },
                    xml("value", {}, `${id}`)
                )
            ),
            xml(
                "set",
                { xmlns: "http://jabber.org/protocol/rsm" },
                xml("max", {}, 1),
                xml("before")
            ),
            xml("flip-page")
        )
    )

    // const fetchLastMsg = (fetid:any) => xml(
    //     "iq",
    //     {
    //         type: "set",
    //         id: Date.now().toString
    //     },
    //     xml(
    //         "query",
    //         {
    //             xmlns: "urn:xmpp:mam:2",
    //         },
    //         xml(
    //             "x",
    //             {
    //                 xmlns: "urn:xmpp:mam:2",
    //                 type: "submit"
    //             },
    //             xml(
    //                 "field",
    //                 {
    //                     var: "FORM_TYPE",
    //                     type: "hidden", 
    //                 },
    //                 xml("value",{}, "urn:xmpp:mam:2")
    //             ),
    //             xml(
    //                 "field",
    //                 {
    //                     var: "with"
    //                 },
    //                 xml("value", {}, `${fetid}`)
    //             )
    //         ),
    //         xml(
    //             "set",
    //             { xmlns: "http://jabber.org/protocol/rsm" },
    //             xml("max", {}, 20),
    //             xml("before")
    //         ),
    //         xml("flip-page")
    //     )
    // )

    useEffect(() => {
        console.log("useeffect2 contacts", contactList)
        if (jid && !isEmpty(contactList) && isEmpty(lastMsgId)) {
            setTimeout(() => {
                contactList?.map((item) => {
                    xmpp.send(fetchLastMsg(item.jid)).catch((err: any) => console.log("xontactlist err", err));
                })
            }, 3000)
        }
    }, [contactList])

    return (
        <DmContext.Provider value={{ xmppInstance }}>
            {children}
        </DmContext.Provider>
    )
}

export default DmContextProvider