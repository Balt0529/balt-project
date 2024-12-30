import { Session } from "@supabase/supabase-js";
import { atom } from "recoil";

export const sessionState = atom<Session | null>({
  key: "sessionStateUnique", //ユニークなキーに変更
  default: null,
});