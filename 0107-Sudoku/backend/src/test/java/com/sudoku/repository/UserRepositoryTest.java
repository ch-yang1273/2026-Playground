package com.sudoku.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.sudoku.domain.Role;
import com.sudoku.domain.User;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.ANY)
class UserRepositoryTest {

  @Autowired
  private UserRepository userRepository;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = User.builder()
        .email("test@example.com")
        .password("password123")
        .nickname("testuser")
        .role(Role.USER)
        .build();
  }

  @Test
  void should_saveUser_when_validUserProvided() {
    User savedUser = userRepository.save(testUser);

    assertThat(savedUser.getId()).isNotNull();
    assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
    assertThat(savedUser.getNickname()).isEqualTo("testuser");
    assertThat(savedUser.getRole()).isEqualTo(Role.USER);
  }

  @Test
  void should_findUserByEmail_when_userExists() {
    userRepository.save(testUser);

    Optional<User> foundUser = userRepository.findByEmail("test@example.com");

    assertThat(foundUser).isPresent();
    assertThat(foundUser.get().getEmail()).isEqualTo("test@example.com");
  }

  @Test
  void should_returnEmpty_when_userNotFoundByEmail() {
    Optional<User> foundUser = userRepository.findByEmail("nonexistent@example.com");

    assertThat(foundUser).isEmpty();
  }

  @Test
  void should_returnTrue_when_emailExists() {
    userRepository.save(testUser);

    boolean exists = userRepository.existsByEmail("test@example.com");

    assertThat(exists).isTrue();
  }

  @Test
  void should_returnFalse_when_emailNotExists() {
    boolean exists = userRepository.existsByEmail("nonexistent@example.com");

    assertThat(exists).isFalse();
  }

  @Test
  void should_returnTrue_when_nicknameExists() {
    userRepository.save(testUser);

    boolean exists = userRepository.existsByNickname("testuser");

    assertThat(exists).isTrue();
  }

  @Test
  void should_returnFalse_when_nicknameNotExists() {
    boolean exists = userRepository.existsByNickname("nonexistent");

    assertThat(exists).isFalse();
  }

  @Test
  void should_setCreatedAtAutomatically_when_userSaved() {
    User savedUser = userRepository.save(testUser);

    assertThat(savedUser.getCreatedAt()).isNotNull();
  }
}
