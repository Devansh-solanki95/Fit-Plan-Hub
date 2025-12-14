package com.fit.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fit.entity.Followers;
import com.fit.entity.Users;

@Repository
public interface FollowerRepository extends JpaRepository<Followers, Integer> {

	 Optional<Followers> findByUserAndTrainer(Users user, Users trainer);

	List<Users> findTrainersByUser(Users user);
	
}
