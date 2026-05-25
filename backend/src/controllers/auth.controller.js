const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');


class AuthController {
  async login(req, res, next) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      sendSuccess(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  }

 
  async me(req, res, next) {
    try {
      const student = await authService.getMe(req.user.id);
      sendSuccess(res, student, 'Perfil obtenido correctamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
