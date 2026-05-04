package com.example.passgeneration.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.passgeneration.Entity.Senha;
import com.example.passgeneration.Entity.User;
import com.example.passgeneration.Repository.SenhaRepository;
import com.example.passgeneration.Repository.UserRepository;

@Service
public class SenhaService {

    @Autowired
    private SenhaRepository senhaRepository;

    @Autowired
    private UserRepository userRepository;

    public Senha criar(String name, String pass, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Senha senha = new Senha();
        senha.setName(name);
        senha.setPass(pass);
        senha.setUser(user);

        return senhaRepository.save(senha);
    }

    public List<Senha> listar(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return senhaRepository.findByUserId(user.getId());
    }

    public void deletar(Long id) {
        senhaRepository.deleteById(id);
    }
}