package com.example.passgeneration.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

import com.example.passgeneration.Service.SenhaService;
import com.example.passgeneration.Utils.JwtUtil;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/senhas")
public class SenhaController {

    @Autowired
    private SenhaService service;

    @Autowired
    private JwtUtil jwtUtil;

    private String getEmail(String token) {
        return jwtUtil.getEmail(token.replace("Bearer ", ""));
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {

        String email = getEmail(token);

        return ResponseEntity.ok(
                service.criar(body.get("name"), body.get("pass"), email)
        );
    }

    @GetMapping
    public ResponseEntity<?> listar(
            @RequestHeader("Authorization") String token) {

        String email = getEmail(token);

        return ResponseEntity.ok(service.listar(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {

        service.deletar(id);

        return ResponseEntity.ok("Senha deletada");
    }
}