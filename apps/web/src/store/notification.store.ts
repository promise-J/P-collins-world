import { create } from "zustand";

interface Notification {

 _id:string;

 title:string;

 message:string;

 read:boolean;

 createdAt:string;

}

interface Store {

    notifications:
    Notification[];
   
    unreadCount:number;
   
    setNotifications:
    (
      data:
      Notification[]
    )=>void;
   
    addNotification:
    (
     notification:
     Notification
    )=>void;
   
   }

   export const notificationStore =
create<Store>((set)=>({

 notifications:[],

 unreadCount:0,

 setNotifications:
 (notifications)=>{

  set({

   notifications,

   unreadCount:
   notifications.filter(
    n=>!n.read
   ).length

  });

 },

 addNotification:
 (notification)=>

 set((state)=>({

  notifications:[
   notification,
   ...state.notifications
  ],

  unreadCount:
  state.unreadCount+1

 }))

}));