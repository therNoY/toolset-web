import fetch from '@/config/fetch'

var fetchHelper=async function (url = '', data = {}, type = 'GET', method = 'fetch') {
  try {
	  var  res = await fetch(url,data,type,method);

	  if (res.resultCode != '0') {
	    window.intVue.$store.workStore.commit('setEditStatus', { edit_status: `err,${res.resultText.replace(',','，')}` });
	    throw new Error(res.resultText);
	  }else{
	    return res;
	  }
  } catch (err) {
  	throw Error(err);
  }
};


export const getSourceList = (vue, args) => fetch(vue, '/source/list', args, "GET");
export const getRealUrl = (vue, args) => fetch(vue, '/source/realUrl', args, "GET");
export const getVerification = (vue, args) => fetch(vue, '/resource/verification', args, "GET");
export const verifyion = (vue, args) => fetch(vue, '/resource/url', args);

export const getKuGouList = (vue, args) => fetch(vue, '/ku_gou/music/list/search', args, "GET");
export const getKuGouMusic = (vue, args) => fetch(vue, '/ku_gou/music/get', args, "GET");