const bcrypt = require('bcryptjs');
const studentRepository = require('../repositories/student.repository');
const ApiError = require('../utils/ApiError');
const { requireFields, validatePassword } = require('../utils/validators');

class StudentService {
  /**
   * Retorna todos los estudiantes con soporte de paginación y búsqueda.
   * Reenvía los query params al repositorio correctamente.
   */
  async getAllStudents(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';
    return await studentRepository.findAll({ page, limit, search });
  }

  async getStudentById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }
    return student;
  }

  async createStudent(data) {
    const { name, email, password } = data;

    requireFields({ name, email, password }, ['name', 'email', 'password']);
    validatePassword(password);

    const exists = await studentRepository.findByEmail(email);
    if (exists) {
      throw ApiError.conflict('Ya existe un estudiante con ese email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await studentRepository.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async updateStudent(id, data) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }

    const { name, email } = data;

    if (email && email !== student.email) {
      const emailTaken = await studentRepository.existsByEmail(email, id);
      if (emailTaken) {
        throw ApiError.conflict('Ese email ya está en uso');
      }
    }

    const affectedRows = await studentRepository.update(id, {
      name: name ?? student.name,
      email: email ?? student.email,
    });

    if (affectedRows === 0) {
      throw ApiError.internal('No se pudo actualizar el estudiante');
    }

    return await studentRepository.findById(id);
  }

  /**
   * Cambia la contraseña de un estudiante verificando la contraseña actual.
   */
  async changePassword(id, { currentPassword, newPassword }) {
    requireFields({ currentPassword, newPassword }, ['currentPassword', 'newPassword']);
    validatePassword(newPassword);

    const student = await studentRepository.findWithPasswordById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }

    const isValid = await bcrypt.compare(currentPassword, student.password);
    if (!isValid) {
      throw ApiError.unauthorized('La contraseña actual es incorrecta');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await studentRepository.updatePassword(id, hashed);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async deleteStudent(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }

    const affectedRows = await studentRepository.delete(id);
    if (affectedRows === 0) {
      throw ApiError.internal('No se pudo eliminar el estudiante');
    }

    return { message: 'Estudiante eliminado correctamente' };
  }
}

module.exports = new StudentService();