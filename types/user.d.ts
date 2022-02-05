//* users.json에 저장된 유저 타입
export type StoredUserType = {
  // UserType이 아닌 StoredUserType인 이유는 클라이언트에서 사용하는 user 데이터에는 password를 제공하지 않을 거기 때문
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthday: string;
  profileImage: string;
};
