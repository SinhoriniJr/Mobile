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
    private UserRepository userRepository;

    @Autowired
    private JwtUtil tokenUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void signup(String nome, String email, String senha, String repetirSenha) {

        if (!senha.equals(repetirSenha)) {
            throw new RuntimeException("Senhas nao coincidem");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Email invalido");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email ja cadastrado");
        }

        User user = new User();
        user.setNome(nome);
        user.setEmail(email);
        user.setSenha(passwordEncoder.encode(senha));

        userRepository.save(user);
    }

    public String signin(String email, String senha) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (!passwordEncoder.matches(senha, user.getSenha())) {
            throw new RuntimeException("Senha invalida");
        }

        return tokenUtil.gerarToken(email);
    }
}
