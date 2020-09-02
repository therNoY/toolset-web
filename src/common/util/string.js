
/**
 * 获取一个字符串中的实际长度的前length个字符
 * @param {*} string 
 * @param {*} length 
 */
export function getRealLengthOfString(string, length) {
  let l = 0;
  let i = 0

  for (; i < string.length; i++) {
    let charCode = string.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) l += 1;
    else l += 2;
    if (l >= length) break;
  }

  // 没有便利完 就达到15
  if (i + 2 < string.length) {
    return string.substring(0, i) + " ...";
  } else {
    return string;
  }
}

export {			//关键
	sayMsg
}