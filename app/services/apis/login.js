import { tradeSocket } from '$services';

const USER_LOGIN = 'USER_LOGIN';
/**
 * 该方法用户在用户登入成功拿到token与服务器进行wss通信使用
 * @param {String} user 
 */
const subscribe = (user) => {
  // 乐臣 测试账号
  let testUId = '11137769',
      testToken = 'PQAADewjmQYZNk0z7GJMiWY3zeQzZyObO7ia5slmOGcjByM=';
  // 野芳测试账号
  // let testUId = '11137770',
  //     testToken = 'GwAANJ3IMAZyahNnMUwTM+Y3cwbOQ51xNWXMB7nOZAbE';
  tradeSocket.subscribe({
    req: 'Login',
    rid: USER_LOGIN,
    // expires: (new Date().valueOf() + 1000),
    args: {
      AuthType: 2,
      UserName: user && user.UserName || testUId,
      UserCred: user && user.UserCred || testToken,
      UserSecr: '',
    },
  });
};

export default {
  subscribe,
};
