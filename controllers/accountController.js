const { getPlatform } = require("../utils/ringcentral");

const getAccountInfo = async (req, res) => {
  try {
    const platform = getPlatform();

    if (!platform || !platform.loggedIn()) {
      return res
        .status(401)
        .json({ error: "Not authenticated with RingCentral" });
    }

    const response = await platform.get("/restapi/v1.0/account/~");
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAccountInfo };
