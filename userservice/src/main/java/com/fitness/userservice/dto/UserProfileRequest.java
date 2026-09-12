package com.fitness.userservice.dto;

public class UserProfileRequest {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private Integer age;
    private String gender;
    private Double height; // in cm
    private Double weight; // in kg
    private Double targetWeight; // in kg
    private String fitnessGoal;
    private String fitnessLevel;
    private Integer dailyCalorieTarget;
    private Integer dailyStepTarget;
    private Integer dailyActiveMinutesTarget;
    private String bio;

    public UserProfileRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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
}
