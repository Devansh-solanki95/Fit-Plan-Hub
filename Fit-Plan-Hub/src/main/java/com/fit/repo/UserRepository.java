package com.fit.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fit.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
	
	Optional<Users> findByEmail(String email);

}
