import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Data from "../../../lib/data";
import { StoredUserType } from "../../../types/user";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //* 1. api method가 POST인지 확인
  if (req.method === "POST") {
    const { email, firstname, lastname, password, birthday } = req.body;

    //* 2. req.body에 필요한 값이 전부 들어 있는지 확인
    if (!email || !firstname || !lastname || !password || !birthday) {
      res.statusCode = 400;
      return res.send("필수 데이터가 없습니다.");
    }

    //* 3. email이 중복인지 확인
    const userExist = Data.user.exist({ email }); // 여기가 문제
    if (userExist) {
      res.statusCode = 409;
      res.send("이미 가입된 이메일입니다.");
    }

    //* 4. 패스워드 암호화
    //* bcryptjs
    //* hashSync("문자", salt) 통해 암호 해싱, compareSync("문자", 해시된 문자) 통해 일치하는지 확인
    //* salt (특별한 값) 추가해 해시 해킹 방지
    const hashedPassword = bcrypt.hashSync(password, 8);

    //* 5. 유저 정보 추가
    const users = Data.user.getList();
    let userId;
    if (users.length === 0) {
      userId = 1;
    } else {
      userId = users[users.length - 1].id + 1;
    }
    const newUser: StoredUserType = {
      id: userId,
      email,
      firstname,
      lastname,
      password: hashedPassword,
      birthday,
      profileImage: "/static/image/user/default_user_profile_image.png",
    };

    Data.user.write([...users, newUser]);

    //* 6. 추가된 유저 정보와  token 전달
    //* JWT(Json Web Token)는 전자 서명된 URL로 이용할 수 있는 문자만 구성된 JSON
    //* JWT 이용해 서버와 클라이언트 간 통신할 수 있는 사용자 인증 토큰 만들기
    //* 토큰을 만들기 위해 암호화할 값과 secret 필요
    //* 만들어진 토큰을 브라우저의 쿠키에 저장할 수 있도록 res의 헤더에 'Set-Cookie' 설정
    await new Promise((resolve) => {
      const token = jwt.sign(String(newUser.id), process.env.JWT_SECRET!);
      res.setHeader(
        "Set-Cookie",
        `access_token=${token}; path=/; expires=${new Date(
          Date.now() + 60 * 60 * 24 * 1000 * 3 //3일
        ).toUTCString()}; httponly`
      );
      resolve(token);
    });

    //* 유저 정보 저장하기
    //* 토큰과 함께 생성된 유저 정보 전달하기
    //* 보안상 password는 전달하지 않음
    // eslint-disable-next-line operator-linebreak
    const newUserWithoutPassword: Partial<Pick<StoredUserType, "password">> =
      newUser;

    delete newUserWithoutPassword.password; //* 객체 속성 제거

    //* delete를 사용해 객체 속성 제거하면 해당 객체의 제거될 속성은 optional이어야 한다는 타입 에러가 발생한다.
    //* Partial<Pick<StoredUserType, "password">> : Typescript 유틸리티 중 하나로,
    //* StoredUserType의 password 속성을 Partial로 만든 타입을 만들게 된다.
    res.statusCode = 200;
    return res.send(newUser);
  }
  res.statusCode = 405; // 405 Method Not Allowed

  return res.end();
};
