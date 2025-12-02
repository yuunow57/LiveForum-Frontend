import { api } from "./axios";

export const fetchBoards = () => api.get("/board");
