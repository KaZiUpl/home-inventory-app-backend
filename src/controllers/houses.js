exports.createHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House created.' });
  } catch (error) {
    throw error;
  }
};

exports.getHouseList = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House list placeholder' });
  } catch (error) {
    throw error;
  }
};

exports.getHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House placeholder' });
  } catch (error) {
    throw error;
  }
};

exports.editHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House updated' });
  } catch (error) {
    throw error;
  }
};

exports.deleteHouse = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'House deleted' });
  } catch (error) {
    throw error;
  }
};
