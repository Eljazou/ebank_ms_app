package com.example.customer_service;

import com.example.customer_service.entities.Customer;
import com.example.customer_service.services.CustomerService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CustomerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(CustomerService customerService) {
        return args -> {
            List<Customer> customerList = List.of(
                    Customer.builder().name("Hassan").email("hassan@gmail.com").build(),
                    Customer.builder().name("Mohamed").email("mohamed@gmail.com").build(),
                    Customer.builder().name("Imane").email("imane@gmail.com").build()
            );
            customerList.forEach(customerService::saveCustomer);
        };
    }

}
