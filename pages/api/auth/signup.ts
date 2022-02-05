import { NextApiRequest, NextApiResponse } from "next";
import Data from "../../../lib/data";

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
    return res.end();
  }
  res.statusCode = 405; // 405 Method Not Allowed

  return res.end();
};
