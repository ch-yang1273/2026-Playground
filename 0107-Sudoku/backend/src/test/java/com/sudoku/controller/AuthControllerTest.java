package com.sudoku.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudoku.domain.Role;
import com.sudoku.domain.User;
import com.sudoku.dto.LoginRequest;
import com.sudoku.dto.SignupRequest;
import com.sudoku.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @BeforeEach
  void setUp() {
    userRepository.deleteAll();
  }

  @Test
  void should_returnCreatedWithToken_when_signupWithValidData() throws Exception {
    SignupRequest request = new SignupRequest(
        "test@example.com",
        "password123",
        "TestUser"
    );

    mockMvc.perform(post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.token").isNotEmpty())
        .andExpect(jsonPath("$.email").value("test@example.com"))
        .andExpect(jsonPath("$.nickname").value("TestUser"))
        .andExpect(jsonPath("$.role").value("USER"));
  }

  @Test
  void should_returnConflict_when_signupWithDuplicateEmail() throws Exception {
    User existingUser = User.builder()
        .email("existing@example.com")
        .password(passwordEncoder.encode("password123"))
        .nickname("ExistingUser")
        .role(Role.USER)
        .build();
    userRepository.save(existingUser);

    SignupRequest request = new SignupRequest(
        "existing@example.com",
        "newpassword123",
        "NewUser"
    );

    mockMvc.perform(post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("Email already exists"));
  }

  @Test
  void should_returnBadRequest_when_signupWithInvalidEmail() throws Exception {
    SignupRequest request = new SignupRequest(
        "invalid-email",
        "password123",
        "TestUser"
    );

    mockMvc.perform(post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  @Test
  void should_returnBadRequest_when_signupWithShortPassword() throws Exception {
    SignupRequest request = new SignupRequest(
        "test@example.com",
        "short",
        "TestUser"
    );

    mockMvc.perform(post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  @Test
  void should_returnOkWithToken_when_loginWithValidCredentials() throws Exception {
    User user = User.builder()
        .email("login@example.com")
        .password(passwordEncoder.encode("password123"))
        .nickname("LoginUser")
        .role(Role.USER)
        .build();
    userRepository.save(user);

    LoginRequest request = new LoginRequest(
        "login@example.com",
        "password123"
    );

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isNotEmpty())
        .andExpect(jsonPath("$.email").value("login@example.com"))
        .andExpect(jsonPath("$.nickname").value("LoginUser"))
        .andExpect(jsonPath("$.role").value("USER"));
  }

  @Test
  void should_returnUnauthorized_when_loginWithWrongPassword() throws Exception {
    User user = User.builder()
        .email("wrong@example.com")
        .password(passwordEncoder.encode("password123"))
        .nickname("WrongUser")
        .role(Role.USER)
        .build();
    userRepository.save(user);

    LoginRequest request = new LoginRequest(
        "wrong@example.com",
        "wrongpassword"
    );

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Invalid email or password"));
  }

  @Test
  void should_returnUnauthorized_when_loginWithNonExistentUser() throws Exception {
    LoginRequest request = new LoginRequest(
        "nonexistent@example.com",
        "password123"
    );

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Invalid email or password"));
  }

  @Test
  void should_returnOk_when_logout() throws Exception {
    mockMvc.perform(post("/api/auth/logout"))
        .andExpect(status().isOk());
  }
}
