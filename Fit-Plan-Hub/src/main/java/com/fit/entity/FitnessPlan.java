package com.fit.entity;

import jakarta.persistence.Column;
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
@Table(name = "fitness-plans")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FitnessPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @Column(length = 1000)
    private String description;

    private Double price;

    private Integer duration; // in days

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Users trainer;

	public FitnessPlan(String title, String description, Double price, Integer duration, Users trainer) {
		super();
		this.title = title;
		this.description = description;
		this.price = price;
		this.duration = duration;
		this.trainer = trainer;
	}

    
}

