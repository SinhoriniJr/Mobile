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
    private SenhaService passwordService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getEmailFromToken(String authorizationHeader) {
        return jwtUtil.getEmail(authorizationHeader.replace("Bearer ", ""));
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> requestBody) {

        String email = getEmailFromToken(authorizationHeader);

        return ResponseEntity.ok(
                passwordService.criar(requestBody.get("name"), requestBody.get("pass"), email)
        );
    }

    @GetMapping
    public ResponseEntity<?> listar(
            @RequestHeader("Authorization") String authorizationHeader) {

        String email = getEmailFromToken(authorizationHeader);

        return ResponseEntity.ok(passwordService.listar(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {

        passwordService.deletar(id);

        return ResponseEntity.ok("Senha deletada");
    }
}
