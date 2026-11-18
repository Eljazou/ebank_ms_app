package com.example.ebank_service.services;

import com.example.ebank_service.entities.BankAccount;
import com.example.ebank_service.feign.CustomerRestClient;
import com.example.ebank_service.model.Customer;
import com.example.ebank_service.repositories.BankAccountRepository;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class BankAccountService {
    private BankAccountRepository bankAccountRepository;
    private CustomerRestClient customerRestClient;

    public BankAccountService(BankAccountRepository bankAccountRepository, CustomerRestClient customerRestClient){
        this.bankAccountRepository = bankAccountRepository;
        this.customerRestClient = customerRestClient;
    }

    @McpTool(description = "Get all bank accounts")
    public List<BankAccount> getAllBankAccounts(){
        return bankAccountRepository.findAll();
    }

    @McpTool(description = "Get a bank account by its id, including its customer")
    public BankAccount getBankAccountById(
            @McpToolParam(description = "The id of the bank account (a UUID string)") String id){
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        bankAccount.setCustomer(customerRestClient.getCustomerById(bankAccount.getCustomerId()));
        return bankAccount;
    }

    @McpTool(description = "Create a new bank account for an existing customer. Do not provide id or createdAt, they are generated automatically.")
    public BankAccount save(
            @McpToolParam(description = "The account to create: balance, type, and customerId ") BankAccount bankAccount){
        try{
            Customer customer = customerRestClient.getCustomerById(bankAccount.getCustomerId());
            bankAccount.setId(UUID.randomUUID().toString());
            bankAccount.setCreatedAt(new Date());
            return bankAccountRepository.save(bankAccount);
        }catch(Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }
}
