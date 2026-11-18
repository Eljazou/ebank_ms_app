package com.example.ebank_service.model;


import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Customer {
    private  Long id;
    private String name;
    private String email ;
}
