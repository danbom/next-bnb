import { NextApiRequest, NextApiResponse } from "next";
import Data from "../../../lib/data";
import bcrypt from "bcryptjs";
import { StoredUserType } from "../../../types/user";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //* 1. api method가 POST인지 확인
  if (req.method === "Post") {
    const { email, firstname, lastname, password, birthday } = req.body;

    //* 2. req.body에 필요한 값이 전부 들어 있는지 확인
    if (!email || !firstname || !lastname || !password || !birthday) {
      res.statusCode = 400;
      return res.send("필수 데이터가 없습니다.");
    }

    //* 3. email이 중복인지 확인
    const userExist = Data.user.exist({ email });
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

    return res.end();
  }
  res.statusCode = 405; // 405 Method Not Allowed

  return res.end();
};
