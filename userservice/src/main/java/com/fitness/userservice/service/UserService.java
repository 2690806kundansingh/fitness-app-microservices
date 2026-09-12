package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserProfileRequest;
import com.fitness.userservice.dto.UserProfileResponse;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserResponse register(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            User existingUser = repository.findByEmail(request.getEmail());
            if (request.getKeycloakId() != null && !request.getKeycloakId().isBlank()) {
                existingUser.setKeycloakId(request.getKeycloakId());
                if (request.getFirstName() != null) existingUser.setFirstName(request.getFirstName());
                if (request.getLastName() != null) existingUser.setLastName(request.getLastName());
                repository.save(existingUser);
            }
            UserResponse userResponse = new UserResponse();
            userResponse.setId(existingUser.getId());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());
            return userResponse;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setKeycloakId(savedUser.getKeycloakId());
        userResponse.setId(savedUser.getId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());

        return userResponse;
    }

    public User findUser(String userIdentifier) {
        if (userIdentifier == null || userIdentifier.isBlank()) {
            userIdentifier = "default-user";
        }
        // Try finding by keycloakId first, then by UUID id, then by email
        Optional<User> byKeycloak = repository.findByKeycloakId(userIdentifier);
        if (byKeycloak.isPresent()) {
            return byKeycloak.get();
        }
        Optional<User> byId = repository.findById(userIdentifier);
        if (byId.isPresent()) {
            return byId.get();
        }
        if (repository.existsByEmail(userIdentifier)) {
            return repository.findByEmail(userIdentifier);
        }

        // If user is validated via Keycloak but record was not persisted yet, create stub
        User stub = new User();
        stub.setKeycloakId(userIdentifier);
        String stubEmail = userIdentifier.contains("@") ? userIdentifier : (userIdentifier + "@fitnessapp.local");
        if (repository.existsByEmail(stubEmail)) {
            stubEmail = "user_" + System.currentTimeMillis() + "@fitnessapp.local";
        }
        stub.setEmail(stubEmail);
        stub.setPassword("default@123");
        stub.setProfileCompleted(false);
        return repository.save(stub);
    }

    public UserResponse getUserProfile(String userId) {
        User user = findUser(userId);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setPassword(user.getPassword());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        return userResponse;
    }

    public UserProfileResponse getDetailedProfile(String userIdentifier) {
        User user = findUser(userIdentifier);
        return mapToProfileResponse(user);
    }

    public UserProfileResponse updateUserProfile(String userIdentifier, UserProfileRequest request) {
        User user = findUser(userIdentifier);

        if (request.getEmail() != null && !request.getEmail().isBlank() && !repository.existsByEmail(request.getEmail())) {
            user.setEmail(request.getEmail());
        }
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        if (request.getTargetWeight() != null) user.setTargetWeight(request.getTargetWeight());
        if (request.getFitnessGoal() != null) user.setFitnessGoal(request.getFitnessGoal());
        if (request.getFitnessLevel() != null) user.setFitnessLevel(request.getFitnessLevel());
        if (request.getDailyCalorieTarget() != null) user.setDailyCalorieTarget(request.getDailyCalorieTarget());
        if (request.getDailyStepTarget() != null) user.setDailyStepTarget(request.getDailyStepTarget());
        if (request.getDailyActiveMinutesTarget() != null) user.setDailyActiveMinutesTarget(request.getDailyActiveMinutesTarget());
        if (request.getBio() != null) user.setBio(request.getBio());

        user.setProfileCompleted(true);
        User saved = repository.save(user);
        return mapToProfileResponse(saved);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        UserProfileResponse res = new UserProfileResponse();
        res.setId(user.getId());
        res.setKeycloakId(user.getKeycloakId());
        res.setEmail(user.getEmail());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setAge(user.getAge() != null ? user.getAge() : 28);
        res.setGender(user.getGender() != null ? user.getGender() : "male");
        res.setHeight(user.getHeight() != null ? user.getHeight() : 175.0);
        res.setWeight(user.getWeight() != null ? user.getWeight() : 72.0);
        res.setTargetWeight(user.getTargetWeight() != null ? user.getTargetWeight() : 70.0);
        res.setFitnessGoal(user.getFitnessGoal() != null ? user.getFitnessGoal() : "General Fitness & Health");
        res.setFitnessLevel(user.getFitnessLevel() != null ? user.getFitnessLevel() : "Intermediate");
        res.setDailyCalorieTarget(user.getDailyCalorieTarget() != null ? user.getDailyCalorieTarget() : 2200);
        res.setDailyStepTarget(user.getDailyStepTarget() != null ? user.getDailyStepTarget() : 10000);
        res.setDailyActiveMinutesTarget(user.getDailyActiveMinutesTarget() != null ? user.getDailyActiveMinutesTarget() : 45);
        res.setBio(user.getBio() != null ? user.getBio() : "");
        res.setProfileCompleted(Boolean.TRUE.equals(user.getProfileCompleted()));
        res.setCreatedAt(user.getCreatedAt());
        res.setUpdatedAt(user.getUpdatedAt());

        // Derived biometrics calculations
        double heightM = res.getHeight() / 100.0;
        double bmiVal = heightM > 0 ? res.getWeight() / (heightM * heightM) : 0.0;
        res.setBmi(Math.round(bmiVal * 10.0) / 10.0);

        if (res.getBmi() < 18.5) {
            res.setBmiCategory("Underweight");
        } else if (res.getBmi() < 25.0) {
            res.setBmiCategory("Normal");
        } else if (res.getBmi() < 30.0) {
            res.setBmiCategory("Overweight");
        } else {
            res.setBmiCategory("Obese");
        }

        // BMR (Mifflin-St Jeor)
        double bmrVal;
        if ("female".equalsIgnoreCase(res.getGender())) {
            bmrVal = 10 * res.getWeight() + 6.25 * res.getHeight() - 5 * res.getAge() - 161;
        } else {
            bmrVal = 10 * res.getWeight() + 6.25 * res.getHeight() - 5 * res.getAge() + 5;
        }
        res.setBmr((int) Math.round(bmrVal));
        res.setMaintenanceCalories((int) Math.round(bmrVal * 1.55));
        res.setMaxHeartRate(220 - res.getAge());

        return res;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return repository.existsByKeycloakId(userId) || repository.existsById(userId);
    }
}
