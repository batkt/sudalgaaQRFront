import data from "//app/data/sudalgaa.json";

export default function handler(req, res) {
  res.status(200).json(data);
}
