package com.fitness.userservice.dto;

import java.time.LocalDateTime;

public class UserProfileResponse {
    private String id;
    private String keycloakId;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private Double targetWeight;
    private String fitnessGoal;
    private String fitnessLevel;
    private Integer dailyCalorieTarget;
    private Integer dailyStepTarget;
    private Integer dailyActiveMinutesTarget;
    private String bio;
    private Boolean profileCompleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Calculated fields
    private Double bmi;
    private String bmiCategory;
    private Integer bmr;
    private Integer maintenanceCalories;
    private Integer maxHeartRate;

    public UserProfileResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getKeycloakId() { return keycloakId; }
    public void setKeycloakId(String keycloakId) { this.keycloakId = keycloakId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Double getTargetWeight() { return targetWeight; }
    public void setTargetWeight(Double targetWeight) { this.targetWeight = targetWeight; }

    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public String getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }

    public Integer getDailyCalorieTarget() { return dailyCalorieTarget; }
    public void setDailyCalorieTarget(Integer dailyCalorieTarget) { this.dailyCalorieTarget = dailyCalorieTarget; }

    public Integer getDailyStepTarget() { return dailyStepTarget; }
    public void setDailyStepTarget(Integer dailyStepTarget) { this.dailyStepTarget = dailyStepTarget; }

    public Integer getDailyActiveMinutesTarget() { return dailyActiveMinutesTarget; }
    public void setDailyActiveMinutesTarget(Integer dailyActiveMinutesTarget) { this.dailyActiveMinutesTarget = dailyActiveMinutesTarget; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Boolean getProfileCompleted() { return profileCompleted; }
    public void setProfileCompleted(Boolean profileCompleted) { this.profileCompleted = profileCompleted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public String getBmiCategory() { return bmiCategory; }
    public void setBmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; }

    public Integer getBmr() { return bmr; }
    public void setBmr(Integer bmr) { this.bmr = bmr; }

    public Integer getMaintenanceCalories() { return maintenanceCalories; }
    public void setMaintenanceCalories(Integer maintenanceCalories) { this.maintenanceCalories = maintenanceCalories; }

    public Integer getMaxHeartRate() { return maxHeartRate; }
    public void setMaxHeartRate(Integer maxHeartRate) { this.maxHeartRate = maxHeartRate; }
}
