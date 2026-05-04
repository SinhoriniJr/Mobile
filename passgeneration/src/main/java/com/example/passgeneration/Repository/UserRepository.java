package com.example.passgeneration.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.example.passgeneration.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}