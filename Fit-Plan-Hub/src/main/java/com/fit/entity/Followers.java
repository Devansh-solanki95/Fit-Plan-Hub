package com.fit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "followers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Followers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="userId")
    private Users user;

    @ManyToOne
    @JoinColumn(name="trainerId")
    private Users trainer;

	public Followers(Users user, Users trainer) {
		super();
		this.user = user;
		this.trainer = trainer;
	}
    
    
}
