package com.sudoku.service;

import com.sudoku.domain.Role;
import com.sudoku.domain.User;
import com.sudoku.dto.AuthResponse;
import com.sudoku.dto.LoginRequest;
import com.sudoku.dto.SignupRequest;
import com.sudoku.exception.DuplicateEmailException;
import com.sudoku.exception.DuplicateNicknameException;
import com.sudoku.exception.InvalidCredentialsException;
import com.sudoku.repository.UserRepository;
import com.sudoku.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  @Transactional
  public AuthResponse signup(SignupRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new DuplicateEmailException("Email already exists");
    }

    if (userRepository.existsByNickname(request.getNickname())) {
      throw new DuplicateNicknameException("Nickname already exists");
    }

    User user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .nickname(request.getNickname())
        .role(Role.USER)
        .build();

    User savedUser = userRepository.save(user);
    String token = jwtUtil.generateToken(savedUser);

    return new AuthResponse(
        token,
        savedUser.getEmail(),
        savedUser.getNickname(),
        savedUser.getRole().name()
    );
  }

  public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new InvalidCredentialsException("Invalid email or password");
    }

    String token = jwtUtil.generateToken(user);

    return new AuthResponse(
        token,
        user.getEmail(),
        user.getNickname(),
        user.getRole().name()
    );
  }
}
