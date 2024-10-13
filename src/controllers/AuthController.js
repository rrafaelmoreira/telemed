const users = [];

export default {
  login(email, password) {
    // Lógica de login
    console.log('Login:', email, password);
    const user = users.find(user => user.email === email && user.password === password);
    return !!user; // Retorna true se o usuário for encontrado, caso contrário, false
  },
  register(email, password) {
    // Lógica de registro
    console.log('Register:', email, password);
    const userExists = users.some(user => user.email === email);
    if (!userExists) {
      users.push({ email, password });
      return true; // Registro bem-sucedido
    }
    return false; // Usuário já existe
  }
};