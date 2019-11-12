import {request} from './request'

export const GetTest = (url) => request(url, "", "GET");
export const PostTest = (url, args) => request(url, args, "POST");

