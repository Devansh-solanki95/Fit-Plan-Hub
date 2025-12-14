package com.fit.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fit.entity.FitnessPlan;
import com.fit.entity.Users;

@Repository
public interface FitnessPlanRepository extends JpaRepository<FitnessPlan, Integer> {

    List<FitnessPlan> findByTrainer(Users trainer);
}
