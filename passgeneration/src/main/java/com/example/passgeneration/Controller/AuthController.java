package com.example.passgeneration.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

import com.example.passgeneration.Service.AuthService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> requestBody) {

        authService.signup(
                requestBody.get("nome"),
                requestBody.get("email"),
                requestBody.get("senha"),
                requestBody.get("repetirSenha")
        );

        return ResponseEntity.ok("Usuario criado");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> requestBody) {

        String token = authService.signin(
                requestBody.get("email"),
                requestBody.get("senha")
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/signout")
    public ResponseEntity<?> signout() {
        return ResponseEntity.ok("Logout feito");
    }
}
