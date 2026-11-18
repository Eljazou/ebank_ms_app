package com.example.customer_service.services;


import com.example.customer_service.entities.Customer;
import com.example.customer_service.repositories.CustomerRepository;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private CustomerRepository customerRepository;


    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @McpTool(description = "Get All customers")
    public List<Customer> getAllCustomers(){
        return customerRepository.findAll();
    }

    @McpTool(description = "Find a customer By Id")
    public Customer findCustomerById(@McpToolParam(description = "Identifiant du client") Long id){
        return customerRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Customer not found "));
    }
    @McpTool(description = "Save a new customer")
    public Customer saveCustomer(@McpToolParam(description = "le client a enregistrer (nom,email)") Customer customer){
        customer.setId(null);// force la création d'un nouveau client
        return customerRepository.save(customer);
    }
}
