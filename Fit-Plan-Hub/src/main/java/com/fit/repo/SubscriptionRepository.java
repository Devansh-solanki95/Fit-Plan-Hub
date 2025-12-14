package com.fit.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fit.entity.FitnessPlan;
import com.fit.entity.Subscription;
import com.fit.entity.Users;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    boolean existsByUserAndPlan(Users user, FitnessPlan plan);

    List<Subscription> findByUser(Users user);
}
