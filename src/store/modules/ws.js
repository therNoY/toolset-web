import '@/common/lib/sockjs'
import '@/common/lib/stomp'
import { baseUrl } from '@/common/api/env'

// map 状态

const ws = {
  state: {

  },

  mutations: {

  },

  actions: {
    // Ws连接
    wsConnection(store, recordId) {
      store.state.recordId = recordId;
      let url = baseUrl + "/stomp?name=" + recordId;
      console.log("ws 连接 url: " + url);
      // 可以理解为stompClient 
      store.state.stompClient = Stomp.over(new SockJS(url));
      // 建立连接并订阅主题
      store.state.stompClient.connect({}, (frame) => {

        store.state.stompClient.subscribe("/user/queue/user", resps => {
          const resp = JSON.parse(resps.body);


        });

        store.state.stompClient.subscribe("/topic/room/" + recordId, val => {
          console.log("收到房间消息");
          console.log(val);
        });
      })
    },

    // ws 发送消息
    wsSendMes(store, args) {
      let user = { name: store.state.recordId };
      store.state.stompClient.send(
        args.url, user, JSON.stringify(args.mes)
      );
    },

  }
}



export default ws
