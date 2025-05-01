package user.user.repoTests;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import user.user.entity.User;
import user.user.repo.UserRepository;
import user.user.service.UserService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Rollback(false)  // Disable rollback so changes persist between test methods
class UserRepositoryTest {

    @Autowired
    private UserService userRepository;

    // We'll store references to our test users so we can refer to them in later tests
    private User user1;
    private User user2;

//    @Test
//    @Order(1)
//    void testInsertUsers() {
//        user1 = new User(null, "Alice", "alice@example.com", "1234567890", false, 0, false, "alice_pic.png");
//        user2 = new User(null, "Bob", "bob@example.com", "0987654321", false, 0, false, "bob_pic.png");
//
//        userRepository.save(user1);
//        userRepository.save(user2);
//
//        // Check IDs are not null after saving
//        assertNotNull(user1.getId(), "User1's ID should be generated");
//        assertNotNull(user2.getId(), "User2's ID should be generated");
//    }
//
//    @Test
//    @Order(2)
//    void testRetrieveOneById() {
//        // Retrieve user1
//        Optional<User> retrievedUser1 = userRepository.findById(user1.getId());
//        assertTrue(retrievedUser1.isPresent(), "User1 should be present in the database");
//        assertEquals("Alice", retrievedUser1.get().getName(), "Name should match 'Alice'");
//    }
//
//    @Test
//    @Order(3)
//    void testRetrieveAllUsers() {
//        List<User> allUsers = userRepository.findAll();
//        assertEquals(2, allUsers.size(), "Should be 2 users in the database");
//    }
//
//    @Test
//    @Order(4)
//    void testDeleteOneUser() {
//        // Delete user1
//        userRepository.delete(user1);
//
//        // Confirm user1 is removed
//        Optional<User> deletedUser = userRepository.findById(user1.getId());
//        assertFalse(deletedUser.isPresent(), "User1 should be deleted and not present");
//    }
//
//    @Test
//    @Order(5)
//    void testRetrieveAllAfterDeletion() {
//        List<User> remainingUsers = userRepository.findAll();
//        assertEquals(1, remainingUsers.size(), "Only one user should remain");
//        assertEquals("Bob", remainingUsers.get(0).getName(), "The remaining user should be Bob");
//    }
//
//    @Test
//    @Order(6)
//    void testUpdateRemainingUser() {
//        // Update Bob's phone number
//        user2.setPhoneNumber("1112223333");
//        userRepository.save(user2);
//
//        // Retrieve Bob again and check updated phone
//        Optional<User> updatedUser = userRepository.findById(user2.getId());
//        assertTrue(updatedUser.isPresent(), "Updated user (Bob) should be present");
//        assertEquals("1112223333", updatedUser.get().getPhoneNumber(), "Phone number should be updated");
//    }
//
//    @Test
//    @Order(7)
//    void testRemoveRemainingUser() {
//        // Remove user2 (Bob)
//        userRepository.delete(user2);
//
//        // Verify the database is empty
//        List<User> finalUsers = userRepository.findAll();
//        assertTrue(finalUsers.isEmpty(), "Database should be empty after removing Bob");
//    }
}