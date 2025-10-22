const { getAdminFromRequest } = require('../_auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.json({ error: 'Method Not Allowed' });
  }
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    res.statusCode = 401;
    return res.json({ error: 'Unauthorized' });
  }
  return res.json({ user: admin });
};


