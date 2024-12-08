// pages/api/data.ts

import { MOCK_DATA } from "@/src/consts/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    res.status(200).json(MOCK_DATA);
  } catch (error) {
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}
