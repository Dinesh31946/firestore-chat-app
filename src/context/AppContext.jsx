import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'user', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);

            if(userData.avatar && userData.name){
                navigate('/chat');
            }else{
                navigate('/profile');
            }

            //update the lastseen data after login
            await updateDoc(userRef,{
                lastseen: Date.now()
            })

            //update the online status afer every minute
            setInterval(async () => {
                if(auth.currentUser){
                    await updateDoc(userRef,{
                        lastseen: Date.now()
                    })
                }
            }, 60000);

            useEffect( async () => {
                if(userData){
                    const chatRef = doc(db, 'chat', userData.uid);
                    const unSub = onSnapshot(chatRef, async (res) => {
                        const chatItems = res.data().chatsData;
                        const tempData = [];
                        for(const item of chatItems){
                            const userRef = doc(db, 'user', item.rId);
                            const userSnap = await getDoc(userRef);
                            const userData = userSnap.data();
                            tempData.push({...item, userData});
                        }
                        setChatData(tempData.sort((a,b) => b.updatedAt - a.updatedAt));
                    })
                    return () => {
                        unSub();
                    }
                }
            },[userData])

        } catch (error) {
            console.error(error);
        }
    }
    
    const value =  {
        userData, setUserData,
        chatData, setChatData,
        loadUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider;