package com.fit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fit.config.JwtUtils;
import com.fit.entity.FitnessPlan;
import com.fit.entity.Users;
import com.fit.repo.FitnessPlanRepository;
import com.fit.repo.UserRepository;

@RestController
@RequestMapping("/trainer")
public class TrainerController {

    @Autowired
    private FitnessPlanRepository planRepo;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils ;
    
    @PostMapping("/create-plan")
    public ResponseEntity<ApiResponse> createPlan(
            @RequestBody FitnessPlan plan,
            @RequestHeader("Authorization") String token) {

        int trainerId = jwtUtils.extractUserID(token.substring(7));
        Users trainer = userRepository.findById(trainerId).orElseThrow();

        if (!trainer.getRole().equals("TRAINER")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false,"only trainer",null));
        }

        plan.setTrainer(trainer);
        planRepo.save(plan);

        return ResponseEntity.ok(new ApiResponse(true,"Plan created successfully",plan));
    }
    
    @PutMapping("/update-plan/{id}")
    public ResponseEntity<ApiResponse> updatePlan(
            @PathVariable Integer id,
            @RequestBody FitnessPlan updatedPlan,
            @RequestHeader("Authorization") String token) {

        int trainerId = jwtUtils.extractUserID(token.substring(7));

        FitnessPlan plan = planRepo.findById(id).orElseThrow();

        if (!plan.getTrainer().getUserId().equals(trainerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false,"an error occured",null));
        }

        plan.setTitle(updatedPlan.getTitle());
        plan.setDescription(updatedPlan.getDescription());
        plan.setPrice(updatedPlan.getPrice());
        plan.setDuration(updatedPlan.getDuration());

        planRepo.save(plan);
        return ResponseEntity.ok(new ApiResponse(true,"Plan updated successfully successfully",plan));
        
    }
    
    
    
    @DeleteMapping("/delete-plan/{id}")
    public ResponseEntity<ApiResponse> deletePlan(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {

        int trainerId = jwtUtils.extractUserID(token.substring(7));
        FitnessPlan plan = planRepo.findById(id).orElseThrow();

        if (!plan.getTrainer().getUserId().equals(trainerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiResponse(false,"an error occured",null));
        }

        planRepo.delete(plan);
        return ResponseEntity.ok(new ApiResponse(true,"Plan updated successfully successfully",plan));
    }



    
    
    
    
}



