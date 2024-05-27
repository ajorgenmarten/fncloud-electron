import { EndPointNode, ITemplateJson, ResponseNode } from "../../src/app/types";

export interface FileModel {
    name: string,
    path: string,
    content: string,
}

export interface  IObjectTemplate {
    templateName: string
    template: ITemplateJson
}