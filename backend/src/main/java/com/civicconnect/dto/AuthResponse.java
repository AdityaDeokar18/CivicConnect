package com.civicconnect.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private UserDto user;
    private String role;
    private boolean isPending;
    private boolean isRejected;

    public AuthResponse() {}

    public static AuthResponse success(String token, UserDto user, String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(true);
        res.setToken(token);
        res.setUser(user);
        res.setRole(user != null && user.getRole() != null ? user.getRole().name() : null);
        res.setMessage(message);
        return res;
    }

    public static AuthResponse error(String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(false);
        res.setMessage(message);
        return res;
    }

    public static AuthResponse pending(String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(false);
        res.setPending(true);
        res.setMessage(message);
        return res;
    }

    public static AuthResponse rejected(String message) {
        AuthResponse res = new AuthResponse();
        res.setSuccess(false);
        res.setRejected(true);
        res.setMessage(message);
        return res;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isPending() {
        return isPending;
    }

    public void setPending(boolean pending) {
        isPending = pending;
    }

    public boolean isRejected() {
        return isRejected;
    }

    public void setRejected(boolean rejected) {
        isRejected = rejected;
    }
}
