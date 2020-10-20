module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.shv.students.nomoreparties.co');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
};
