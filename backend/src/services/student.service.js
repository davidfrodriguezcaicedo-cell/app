const bcrypt = require('bcryptjs');
const studentRepository = require('../repositories/student.repository');
const ApiError = require('../utils/ApiError');
const { requireFields, validateEmail } = require('../utils/validators');

class StudentService {
  /**
   * Retorna lista paginada de estudiantes con búsqueda opcional.
   * Acepta query params: page, limit, search.
   */
  async getAllStudents(query = {}) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const search = query.search || '';
    return await studentRepository.findAll({ page, limit, search });
  }

  async getStudentById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }
    return student.toPublic();
  }

  async createStudent(data) {
    const { name, email, password } = data;

    // Validar campos obligatorios usando los helpers ya existentes
    requireFields({ name, email, password }, ['name', 'email', 'password']);
    validateEmail(email);

    // Verificar duplicado de email
    const exists = await studentRepository.findByEmail(email.toLowerCase().trim());
    if (exists) {
      throw ApiError.conflict('Ya existe un estudiante con ese email');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = await studentRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return student.toPublic();
  }

  async updateStudent(id, data) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }

    const { name, email } = data;

    // Validar campos obligatorios
    requireFields({ name, email }, ['name', 'email']);
    validateEmail(email);

    // Verificar que el nuevo email no esté en uso por otro estudiante
    if (email.toLowerCase().trim() !== student.email) {
      const another = await studentRepository.findByEmail(email.toLowerCase().trim());
      if (another && another.id !== Number(id)) {
        throw ApiError.conflict('Ese email ya está en uso');
      }
    }

    await studentRepository.update(id, {
      name: name.trim(),
      email: email.toLowerCase().trim(),
    });

    // Retornar el estudiante actualizado
    const updated = await studentRepository.findById(id);
    return updated.toPublic();
  }

  /**
   * PATCH /api/students/:id/password
   * Cambia la contraseña de un estudiante verificando la contraseña actual.
   */
  async changePassword(id, data) {
    const { currentPassword, newPassword } = data;

    requireFields({ currentPassword, newPassword }, ['currentPassword', 'newPassword']);

    // Necesitamos el hash actual → usar findWithPasswordById
    const student = await studentRepository.findWithPasswordById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }

    const isValid = await bcrypt.compare(currentPassword, student.password);
    if (!isValid) {
      throw ApiError.unauthorized('La contraseña actual es incorrecta');
    }

    if (newPassword.length < 6) {
      throw ApiError.badRequest('La nueva contraseña debe tener al menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await studentRepository.updatePassword(id, hashedPassword);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async deleteStudent(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw ApiError.notFound('Estudiante no encontrado');
    }

    await studentRepository.delete(id);
    return { message: 'Estudiante eliminado correctamente' };
  }
}

module.exports = new StudentService();