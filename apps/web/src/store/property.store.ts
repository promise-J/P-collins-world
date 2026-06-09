import { create } from "zustand";

interface PropertyStore {
  compareIds: string[];

  addToCompare: (
    propertyId: string
  ) => void;

  removeFromCompare: (
    propertyId: string
  ) => void;

  clearCompare: () => void;
}

export const propertyStore =
create<PropertyStore>((set) => ({

 compareIds: [],

 addToCompare:(id)=>
 set((state)=>({

  compareIds:[
   ...new Set([
    ...state.compareIds,
    id
   ])
  ]

 })),

 removeFromCompare:(id)=>
 set((state)=>({

  compareIds:
  state.compareIds.filter(
   x=>x!==id
  )

 })),

 clearCompare:()=>
 set({
  compareIds:[]
 })

}));