package com.example.passgeneration.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "senhas")
public class Senha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String pass;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // GETTERS E SETTERS

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPass() {
        return pass;
    }

    public User getUser() {
        return user;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public void setUser(User user) {
        this.user = user;
    }
}