import { EndPointNode } from "../../src/app/types";

export interface FileModel {
    name: string,
    path: string,
    content: string,
}

export interface ServiceJson {
    endPoints: EndPointNode[],
}