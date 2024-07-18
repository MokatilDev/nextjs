import { User } from "@/types/user";
import axios from "axios";


export const createUserFn = (body: User) => {
    axios.post("http://localhost:3000/api/users",body)
}