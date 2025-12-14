package com.fit.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fit.config.JwtUtils;
import com.fit.entity.FitnessPlan;
import com.fit.entity.Followers;
import com.fit.entity.Subscription;
import com.fit.entity.Users;
import com.fit.model.LoginModel;
import com.fit.model.LoginResponse;
import com.fit.model.UserModel;
import com.fit.repo.FitnessPlanRepository;
import com.fit.repo.FollowerRepository;
import com.fit.repo.SubscriptionRepository;
import com.fit.repo.UserRepository;
import com.fit.service.UserService;


@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private UserService userService;
	
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private FitnessPlanRepository planRepo;
    
    @Autowired
    private SubscriptionRepository subscriptionRepo;
    
    @Autowired
    private FollowerRepository followerRepo;
	
	    @PostMapping("/login")
	    public ResponseEntity<ApiResponse> login( @RequestBody LoginModel model) {
	
	        Users user = (Users) userService.loadUserByUsername(model.getEmail());
	
	        System.err.println(model.getEmail());
	        // ✅ FIX 1: Null check FIRST
	        if (user == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                    .body(new ApiResponse(false, "User not found", null));
	        }
	        
	        System.err.println(user);
	
	        String rawPassword = model.getPassword();
	        System.err.println(model.getPassword());
	        
	        System.err.println(user.getPassword());
	        String storedPassword = user.getPassword();
	        
	        System.err.println(storedPassword);
	        
	
	        boolean passwordMatches;
	
	        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
	            passwordMatches = passwordEncoder.matches(rawPassword, storedPassword);
	        } else {
	            passwordMatches = rawPassword.equals(storedPassword);
	        }
	
	        if (!passwordMatches) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                    .body(new ApiResponse(false, "Invalid credentials", null));
	        }
	
	        authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                        model.getEmail(),
	                        model.getPassword()
	                )
	        );
	
	        String token = jwtUtils.generateToken(user.getUserId());
	
	        return ResponseEntity.ok(
	                new ApiResponse(true,
	                        "Login Successfully as : " + user.getRole(),
	                        new LoginResponse(token,user.getRole()))
	        );
	    }

	
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> saveAdmin(@RequestBody UserModel model)
    {
        Boolean status = userService.saveUser(model);
        return ResponseEntity.ok(new ApiResponse(status, status ? "User saved successfully" : "user not saved", model));
    }
	
    
    @PostMapping("/subscribe/{planId}")
    public ResponseEntity<ApiResponse> subscribe(
            @PathVariable Integer planId,
            @RequestHeader("Authorization") String token) {

        int userId = jwtUtils.extractUserID(token.substring(7));
        Users user = userRepo.findById(userId).orElseThrow();
        FitnessPlan plan = planRepo.findById(planId).orElseThrow();

        if (subscriptionRepo.existsByUserAndPlan(user, plan)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false,"Unable to subscribe",null));
        }

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setSubscribedDate(LocalDate.now());

        subscriptionRepo.save(sub);
        return ResponseEntity.ok(new ApiResponse(true,"Plan Subscribed successfully",plan));
    }
    
    @GetMapping("/plans")
    public List<Map<String, Object>> viewAllPlans() {
        return planRepo.findAll().stream().map(plan -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", plan.getTitle());
            map.put("trainer", plan.getTrainer().getName());
            map.put("price", plan.getPrice());
            return map;
        }).toList();
    }
    
    @GetMapping("/plan/{id}")
    public ResponseEntity<?> viewPlan(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {

        int userId = jwtUtils.extractUserID(token.substring(7));
        Users user = userRepo.findById(userId).orElseThrow();
        FitnessPlan plan = planRepo.findById(id).orElseThrow();

        if (!subscriptionRepo.existsByUserAndPlan(user, plan)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(false,"Subscribe to view full plan",null));
        }

        return ResponseEntity.ok(new ApiResponse(true,"FULL PLAN",plan));
    }

    
    @PostMapping("/follow/{trainerId}")
    public ResponseEntity<ApiResponse> followTrainer(
            @PathVariable Integer trainerId,
            @RequestHeader("Authorization") String token) {

        int userId = jwtUtils.extractUserID(token.substring(7));
        Users user = userRepo.findById(userId).orElseThrow();
        Users trainer = userRepo.findById(trainerId).orElseThrow();

        Followers follow = new Followers();
        follow.setUser(user);
        follow.setTrainer(trainer);

        followerRepo.save(follow);
        return ResponseEntity.ok(new ApiResponse(true,"Trainer followed successfully",follow));
    }

    
    @DeleteMapping("/unfollow/{trainerId}")
    public ResponseEntity<ApiResponse> unfollowTrainer(
            @PathVariable Integer trainerId,
            @RequestHeader("Authorization") String token) {

        int userId = jwtUtils.extractUserID(token.substring(7));

        Users user = userRepo.findById(userId).orElseThrow();
        Users trainer = userRepo.findById(trainerId).orElseThrow();

        Followers follow = followerRepo
                .findByUserAndTrainer(user, trainer)
                .orElse(null);

        if (follow == null) {
            return ResponseEntity.badRequest().body(new ApiResponse( true,"You are not following this trainer",null));
        }

        followerRepo.delete(follow);
        return ResponseEntity.ok(new ApiResponse(true,"Unfollowed trainer successfully",null));
    }

    
    @GetMapping("/feed")
    public List<Map<String, Object>> feed(
            @RequestHeader("Authorization") String token) {

        int userId = jwtUtils.extractUserID(token.substring(7));
        Users user = userRepo.findById(userId).orElseThrow();

        List<Users> followedTrainers = followerRepo.findTrainersByUser(user);

        List<FitnessPlan> plans = planRepo.findByTrainerIn(followedTrainers);

        return plans.stream().map(plan -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", plan.getTitle());
            map.put("trainer", plan.getTrainer().getName());
            map.put("price", plan.getPrice());
            map.put("purchased",
                    subscriptionRepo.existsByUserAndPlan(user, plan));
            return map;
        }).toList();
    }




}
