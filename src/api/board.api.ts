import { api } from "./axios";

export const fetchBoards = () => {
    return api.get("/boards");
};