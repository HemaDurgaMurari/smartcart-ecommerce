package com.klu.dto;

import com.klu.model.Role;

public class AuthResponse {

    private Long userId;
    private String name;
    private String email;
    private Role role;
    private String message;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(
            Long userId,
            String name,
            String email,
            Role role,
            String message,
            String token) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.message = message;
        this.token = token;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}