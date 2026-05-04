package com.example.passgeneration.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.passgeneration.Repository.UserRepository;
import com.example.passgeneration.Entity.User;
import com.example.passgeneration.Utils.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public void signup(String nome, String email, String senha, String repetirSenha) {

        if (!senha.equals(repetirSenha)) {
            throw new RuntimeException("Senhas não coincidem");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Email inválido");
        }

        if (repository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        User user = new User();
        user.setNome(nome);
        user.setEmail(email);
        user.setSenha(encoder.encode(senha));

        repository.save(user);
    }

    public String signin(String email, String senha) {

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!encoder.matches(senha, user.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return jwtUtil.gerarToken(email);
    }
}