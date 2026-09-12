package com.fitness.aiservice.repository;

import com.fitness.aiservice.model.BotMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BotMessageRepository extends MongoRepository<BotMessage, String> {
    List<BotMessage> findByUserIdOrderByTimestampAsc(String userId);
    void deleteByUserId(String userId);
}
