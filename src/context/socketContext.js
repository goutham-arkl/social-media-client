import {createContext} from "react";
import { io } from "socket.io-client";
export const socket = io('https://socket.nutranation.ml')
export const SocketContext = createContext();