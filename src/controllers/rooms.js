// TODO: implementation
exports.createRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room created.' });
  } catch (error) {
    next(error);
  }
};

// TODO: implementation
exports.modifyRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room modified.' });
  } catch (error) {
    next(error);
  }
};

// TODO: implementation
exports.getRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room created.' });
  } catch (error) {
    next(error);
  }
};

// TODO: implementation
exports.deleteRoom = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Room deleted.' });
  } catch (error) {
    next(error);
  }
};
