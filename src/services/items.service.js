exports.test = async function () {
  try {
    return { message: 'tested correctly' };
  } catch (error) {
    throw error;
  }
};
