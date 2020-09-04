import {request} from './request'

const get = "GET";
const post = "POST";
const put = "PUT";
const del = "DELETE";


export const getKuGouList = (args) => request('/ku_gou/music/list/search', args, "GET");
export const getKuGouMusic = (args) => request('/ku_gou/music/get', args, "GET");
export const addInfoToEs = (args) => request('/ku_gou/addInfoToEs', args, "GET");
export const addInfosToEs = (args) => request('/ku_gou/addInfosToEs', args, "POST");

export const getSourceList = (args) => request('/source/list', args, "GET");
export const getRealUrl = (args) => request('/source/realUrl', args, "GET");
export const getVerification = (args) => request('/resource/verification', args, "GET");
export const verifyion = (args) => frequest('/resource/url', args);

export const GetTest = (url) => request(url, "", get);
export const PostTest = (url, args) => request(url, args, post);
// 随机音乐
export const RandomMusic = () => request("/randomMusic", "", get);
// 随机图片
export const randomImg = () => request("/randomImg", "", get);
// 随机的一句话
export const randomSentence = () => request("/randomSentence", "", get);
// 登录
export const login = (args) => request("/login", args, post);
// 注册
export const register = (args) => request("/register", args, post);
// 根据token 获取用户
export const getUserByToken = (args) => request("/userInfo", args, post);

// 获取连接的所有数据源
export const getConnectSource = (args) => request("/api/connect/list", args, get);
// 打开一个数据源连接
export const openSource = (args) =>  request("/api/connect/list", args, get);
// 测试连接
export const testConn = (args) =>  request("/api/connect/test", args, post);

// 添加到编辑项目里面
export const saveHttpReqItem = (args) =>  request("/api/httpReq/item", args, put);

// 更新item
export const updateHttpReqItem = (args) =>  request("/api/httpReq/item", args, post);

// 更新url 获取更新后的结果 
export const updateHttpReqItemUrl = (args) =>  request("/api/httpReq/item/url", args, post);

// 修改status 状态
export const updateHttpReqItemStatus = (args) =>  request("/api/httpReq/item/status", args, post);

// 更新url 获取更新后的结果
export const saveHttpReqItemChange = (args) =>  request("/api/httpReq/item/save", args, post);

// 获取用户httpReq 的历史
export const getUserHttpReqHistory = (args) =>  request("/api/httpReq/history/list", args, get);

// 获取用户httpReq 的历史
export const getUserHttpReqCollection = () =>  request("/api/httpReq/collection/list", "", get);

// 获取用户httpReq 的历史
export const getUserNoItemHttpReqCollection = () =>  request("/api/httpReq/noItemCollection/list", "", get);

// 获取用户httpReq 的历史
export const saveItemToCollect = (args) =>  request("/api/httpReq/collection/saveItemToCollect", args, post);

// 获取用户httpReq 的编辑列表
export const getUserHttpReqEdit = (args) =>  request("/api/httpReq/edit/list", args, get);

// 获取一个通用的请求头
export const getCommonHeaderKey = () =>  request("/httpReq/commonHeader", "", get);

// 添加一个空的item
export const addNewHttpReqItem = (args) =>  request("/api/httpReq/item/empty", args, put);

// 添加一个新的收藏
export const addNewCollections = (args) =>  request("/api/httpReq/collection", args, put);

// 删除一个正在编辑的HttpReqItem
export const delHttpReqItem = (args) =>  request("/api/httpReq/item", args, del);


// 删除一个正在编辑的HttpReqItem
export const delHttpReqItemFromCollect = (args) =>  request("/api/httpReq/collect/item", args, del);

// 删除一个正在编辑的HttpReqItem
export const delHttpReqHis = (args) =>  request("/api/httpReq/history", args, del);

// 删除用户收藏
export const delHttpReqCollect = (args) =>  request("/api/httpReq/collect", args, del);

export const sendHttp = (args) =>  request("/api/httpReq/sendHttp", args, post);

export const mergeFileRequest = (args) => request("/upload/merge", args, post);






