package com.fit.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fit.entity.Users;
import com.fit.model.UserModel;
import com.fit.repo.UserRepository;

@Service
public class UserService  implements UserDetailsService{
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Optional<Users> op = userRepo.findByEmail(email);
		System.err.println(email);
		if(op.isPresent())
			return op.get();
		else
			return null;
	}
	
	public Users getById(int userid) {
		return userRepo.findById(userid).get();
	}

	 public UserService(PasswordEncoder passwordEncoder) {
	        this.passwordEncoder = passwordEncoder;
	    }

	
	public Boolean saveUser(UserModel model) {
		// TODO Auto-generated method stub
		String rawPassword = model.getPassword();
		String hashedPass = passwordEncoder.encode(rawPassword);
		System.err.println(hashedPass);
		Users newUser = new Users(model.getName(), model.getEmail() , hashedPass , model.getRole());
		
		userRepo.save(newUser);
		System.out.println("user saved successfully");
		
		
		return true;
	}

}
