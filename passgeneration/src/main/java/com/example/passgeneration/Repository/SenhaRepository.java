package com.example.passgeneration.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.passgeneration.Entity.Senha;

public interface SenhaRepository extends JpaRepository<Senha, Long> {

    List<Senha> findByUserId(Long userId);
}